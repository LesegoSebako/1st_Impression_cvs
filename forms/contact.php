<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us | 1st Impression CV's</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Header & Navigation -->
  <header>
    <div class="container">
      <h1>1st Impression CV's</h1>
      <nav>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html" class="active">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Contact Section -->
  <section class="contact-page">
    <div class="container">
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Fill out the form below or reach us at:</p>
      
      <!-- Contact Form -->
      <form action="submit_form.php" method="POST">
        <div class="form-group">
          <label for="name">Full Name:</label>
          <input type="text" id="name" name="name" placeholder="Your Name" required>
        </div>

        <div class="form-group">
          <label for="email">Email Address:</label>
          <input type="email" id="email" name="email" placeholder="Your Email" required>
        </div>

        <div class="form-group">
          <label for="message">Message:</label>
          <textarea id="message" name="message" placeholder="Your Message" required></textarea>
        </div>

        <button type="submit" class="btn-submit">Send Message</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>&copy; 2025 1st Impression CV's. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>
