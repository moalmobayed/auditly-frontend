import React from "react";
import Container from "./Container";

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Legal Counsel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    content:
      "Auditly transformed our contract review process. The AI analysis based on Egyptian law is incredibly accurate and has helped us identify critical legal issues we would have missed.",
  },
  {
    name: "Fatima El-Sayed",
    role: "CTO, Tech Startup",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    content:
      "The contract generation feature saves us hours. All documents are compliant with Egyptian law and ready to use immediately.",
  },
  {
    name: "Omar Khalil",
    role: "Tech Lawyer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    content:
      "As a lawyer on the marketplace, Auditly connects me with clients who need specialized tech law expertise. The platform is professional and efficient.",
  },
  {
    name: "Nour Abdel-Rahman",
    role: "Startup Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nour",
    content:
      "The detailed legal analysis helped us negotiate better terms with investors. The platform understands Egyptian Constitution and tech contracts perfectly.",
  },
  {
    name: "Karim Mostafa",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    content:
      "Auditly gives us confidence in our legal documents. The AI-powered review is thorough and the recommendations are actionable.",
  },
  {
    name: "Yasmin Ibrahim",
    role: "Business Development",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin",
    content:
      "Finding the right tech lawyer through the marketplace was seamless. The platform matched us with an expert who understood our specific needs.",
  },
];

export default function Testimonials() {
  return (
    <div className="text-gray-600 dark:text-gray-300" id="reviews">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Trusted by Legal Professionals and Tech Companies
          </h2>
        </div>
        <div className="md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none"
            >
              <div className="flex gap-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div>
                  <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                    {testimonial.name}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="mt-8">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
