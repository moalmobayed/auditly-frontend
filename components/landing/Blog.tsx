import React from "react";
import Container from "./Container";

const articles = [
  {
    title: "Understanding Egyptian Contract Law",
    excerpt:
      "Essential guide to contract requirements under Egyptian Civil Code and Constitution...",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  },
  {
    title: "Data Protection in Egyptian Law",
    excerpt:
      "Navigate Personal Data Protection Law (151 of 2020) for your tech business...",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    title: "AI in Legal Services: The Future",
    excerpt:
      "How artificial intelligence is transforming legal document review and analysis...",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
];

export default function Blog() {
  return (
    <div id="blog">
      <Container>
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl dark:text-white">
            Legal Insights & Resources
          </h2>
          <p className="lg:mx-auto lg:w-6/12 text-gray-600 dark:text-gray-300">
            Stay informed with the latest updates on Egyptian law, legal tech
            trends, and best practices for technology contracts.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 dark:shadow-none dark:border-gray-700 dark:bg-gray-800 bg-opacity-50 shadow-2xl shadow-gray-600/10"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={article.image}
                  alt="article cover"
                  loading="lazy"
                  width="1000"
                  height="667"
                  className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-6 relative">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {article.title}
                </h3>
                <p className="mt-6 mb-8 text-gray-600 dark:text-gray-300">
                  {article.excerpt}
                </p>
                <a className="inline-block" href="#">
                  <span className="text-info dark:text-blue-300">
                    Read more
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
