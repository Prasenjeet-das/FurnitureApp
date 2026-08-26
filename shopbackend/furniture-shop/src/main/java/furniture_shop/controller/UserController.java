package furniture_shop.controller;
import org.springframework.security.core.Authentication;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import furniture_shop.entity.User;
import furniture_shop.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public User saveUser(@RequestBody User user) {
        return service.saveUser(user);
    }

    
    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {

        return service.updateUser(id, user);
    }
    
    @GetMapping("/profile")
    public User getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        return service.getUserByEmail(email);
    }

    @PutMapping("/profile")
    public User updateMyProfile(Authentication authentication,
                                @RequestBody User user) {

        User existingUser = service.getUserByEmail(authentication.getName());

        if (existingUser == null) {
            return null;
        }

        return service.updateUser(existingUser.getId(), user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        service.deleteUser(id);

        return "User Deleted Successfully";
    }
}