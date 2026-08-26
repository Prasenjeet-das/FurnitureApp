package furniture_shop.controller;

import com.razorpay.RazorpayClient;
import com.razorpay.Order;
import furniture_shop.entity.Payment;
import furniture_shop.repository.PaymentRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentRepository repository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentController(PaymentRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/order")
    public ResponseEntity<?> createPaymentOrder(@RequestBody PaymentRequest request,
                                                Authentication authentication) {
        if (request == null || keyId.isBlank() || keySecret.isBlank()
            || request.amount() <= 0) {
            return ResponseEntity.badRequest().body("Razorpay keys or amount are missing.");
        }

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.amount());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
            Order razorpayOrder = client.orders.create(orderRequest);

            return ResponseEntity.ok(new PaymentOrderResponse(
                    razorpayOrder.get("id"), request.amount(), "INR", keyId));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Unable to create Razorpay order.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request,
                                           Authentication authentication) {
        try {
            if (request == null || request.razorpayOrderId() == null
                    || request.razorpayPaymentId() == null
                    || request.razorpaySignature() == null
                    || request.razorpayOrderId().isBlank()
                    || request.razorpayPaymentId().isBlank()
                    || request.razorpaySignature().isBlank()
                    || request.amount() <= 0) {
                return ResponseEntity.badRequest().body("Invalid payment details.");
            }

            String payload = request.razorpayOrderId() + "|" + request.razorpayPaymentId();
            String expected = hmacSha256(payload, keySecret);

            if (!MessageDigest.isEqual(
                    expected.getBytes(StandardCharsets.UTF_8),
                    request.razorpaySignature().getBytes(StandardCharsets.UTF_8))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed.");
            }

            Payment payment = new Payment();
            payment.setUserEmail(authentication.getName());
            payment.setRazorpayOrderId(request.razorpayOrderId());
            payment.setRazorpayPaymentId(request.razorpayPaymentId());
            payment.setRazorpaySignature(request.razorpaySignature());
            payment.setAmount(request.amount());
            payment.setCurrency("INR");
            payment.setStatus("SUCCESS");
            repository.save(payment);
            return ResponseEntity.ok(payment);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed.");
        }
    }

    private String hmacSha256(String value, String secret) throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(new javax.crypto.spec.SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    public record PaymentRequest(long amount) {}
    public record VerifyPaymentRequest(String razorpayOrderId, String razorpayPaymentId,
                                       String razorpaySignature, long amount) {}
    public record PaymentOrderResponse(String orderId, long amount, String currency, String keyId) {}
}