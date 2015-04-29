# cityreportDashboard
An Angular JS main dashboard with wrappers for calling rest web services with OATH security.
This dashboard should allow for customization, and several configurations.
For implementing different business domains projects with menues and sections.

# Added Zuul Proxy support
Defined in application.yml:
zuul:
  routes:
    services:
      path: /services/**
      url: http://localhost:9001/services

Then by accessing in localhost:8080/services is going to forward to http://localhost:9001/services
