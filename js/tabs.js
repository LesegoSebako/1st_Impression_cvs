// JavaScript to handle tab switching
function showTab(type) {
  // Get all tab contents
  const allTabs = document.querySelectorAll('.tab-content');
  const allTabLinks = document.querySelectorAll('.tab-link');

  // Hide all tab contents
  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all tab links
  allTabLinks.forEach(link => {
    link.classList.remove('active');
  });

  // Show the selected tab content
  const activeTab = document.getElementById(type + '-services');
  activeTab.classList.add('active');

  // Add active class to the clicked tab button
  const activeLink = document.querySelector(`[data-tab="${type}"]`);
  activeLink.classList.add('active');
}

// Add event listeners to each tab button
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', () => {
    showTab(link.dataset.tab);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Remove 'active' from all tabs and contents
      tabLinks.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add 'active' to clicked tab and corresponding content
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});

