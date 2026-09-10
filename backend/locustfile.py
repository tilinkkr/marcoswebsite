from locust import HttpUser, between, task


class MarcosVisitor(HttpUser):
    wait_time = between(0.4, 1.2)

    @task(5)
    def blogs(self):
        self.client.get("/api/v1/blogs", name="GET blogs")

    @task(4)
    def article(self):
        self.client.get("/api/v1/blogs/prop-firm-rules-india-2026", name="GET article")

    @task(3)
    def products(self):
        self.client.get("/api/v1/products", name="GET products")

    @task(1)
    def contact(self):
        self.client.post(
            "/api/v1/contact-messages",
            json={
                "name": "Load Test",
                "email": "load@example.com",
                "topic": "General",
                "message": "Automated development load-test message with sufficient detail.",
                "website": "",
            },
            name="POST contact",
        )

    @task(1)
    def team_application(self):
        self.client.post(
            "/api/v1/team-applications",
            data={
                "full_name": "Load Test",
                "email": "load@example.com",
                "mobile": "9999999999",
                "location": "India",
                "area": "Technology",
                "why_marcos": "I want to contribute careful systems thinking to the MARCOS platform.",
                "contribution": "I can contribute engineering review and reliable product operations.",
            },
            name="POST team application",
        )
