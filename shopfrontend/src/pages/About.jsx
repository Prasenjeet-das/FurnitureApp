import Footer from "../components/Footer";

function About() {
  return (
    <>
      <main className="container py-5">
        <section className="about-intro mb-5">
          <p className="text-uppercase text-muted fw-semibold mb-2">About Furniture Shop</p>
          <h1 className="mb-3">Furniture that makes your space feel like home</h1>
          <p className="lead mb-0">
            We bring together thoughtful design, lasting quality, and everyday
            comfort to help you create a home that reflects your style.
          </p>
        </section>

        <section className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="h-100 p-4 bg-white border rounded">
              <h2 className="h4 mb-3">Designed for modern living</h2>
              <p className="mb-0">
                From elegant beds and relaxing sofas to practical tables and
                chairs, our collection is made to bring beauty and function to
                every room. Each piece is selected to make daily living more
                comfortable and inviting.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-4 bg-white border rounded">
              <h2 className="h4 mb-3">Quality you can enjoy every day</h2>
              <p className="mb-0">
                We believe good furniture should look beautiful, feel reliable,
                and offer excellent value. That is why we focus on comfortable
                finishes, timeless styles, and a smooth shopping experience.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center py-3">
          <h2 className="mb-3">Make your home yours</h2>
          <p className="mb-0">
            Explore our collection and find the pieces that turn your house into
            a warm, comfortable, and personal space.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;
