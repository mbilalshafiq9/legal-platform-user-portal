import React, { useState } from "react";
import "./help-support.css";

const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I post a legal question?",
      answer: "To post a legal question, navigate to the 'Post Question' section from the dashboard or sidebar. Click on the 'Post Your Legal Issues' card, fill in your question details, select the appropriate jurisdiction, and submit. You can also attach relevant documents to provide more context."
    },
    {
      id: 2,
      question: "What types of legal services are available?",
      answer: "Our platform offers various legal services including criminal law, corporate law, family law, real estate law, intellectual property law, and tax law. You can browse lawyers by category and jurisdiction to find the right legal expert for your needs."
    },
    {
      id: 3,
      question: "How do I hire a lawyer?",
      answer: "You can hire a lawyer by visiting the 'Lawyers' page from the sidebar. Browse through available lawyers, view their profiles, practice areas, and pricing options. Click on a lawyer to see detailed information and contact them directly through the platform."
    },
    {
      id: 4,
      question: "How do I create a new case?",
      answer: "To create a new case, click on the 'Create New Case' card from the dashboard or navigate to 'My Cases' section. Fill in the required information including jurisdiction, type of legal consultant, case category, and provide a detailed explanation of your case. You can also attach relevant documents."
    },
    {
      id: 5,
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit cards, debit cards, and online payment gateways. Payment is processed securely through our platform. You can view pricing options for each service before making a decision."
    },
    {
      id: 6,
      question: "How do I view my posted questions?",
      answer: "You can view all your posted questions by navigating to the 'Post Question' or 'Ask Question' section. All your questions will be listed there with their status, number of views, and lawyer responses. You can click on any question to see detailed responses."
    },
    {
      id: 7,
      question: "Can I edit or delete my posted questions?",
      answer: "Currently, once a question is posted, it cannot be edited. However, you can view all your questions and their responses. If you need to make changes, you can post a new question with the updated information."
    },
    {
      id: 8,
      question: "How do I contact a lawyer directly?",
      answer: "You can contact lawyers through the chat feature. Navigate to 'My Lawyers' or 'Chat' section, select the lawyer you want to communicate with, and start a conversation. You can also view lawyer profiles and contact information on their detail pages."
    },
    {
      id: 9,
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, you can reset it through the login page. Click on 'Forgot Password' link, enter your registered email address, and follow the instructions sent to your email to reset your password securely."
    },
    {
      id: 10,
      question: "How do I update my account information?",
      answer: "You can update your account information by clicking on your profile icon in the header and selecting 'Account Settings'. From there, you can change your email address, update your password, and modify other account details."
    },
    {
      id: 11,
      question: "Are my conversations with lawyers confidential?",
      answer: "Yes, all conversations between you and lawyers are confidential and secure. We use end-to-end encryption to protect your privacy. Your personal information and case details are never shared with third parties without your explicit consent."
    },
    {
      id: 12,
      question: "How do I know if a lawyer is available?",
      answer: "Lawyers are categorized as 'Active' or 'Inactive' in the 'My Lawyers' section. Active lawyers are currently available and responsive. You can also check their response time and availability status on their profile pages."
    },
    {
      id: 13,
      question: "What is the difference between posting a question and creating a case?",
      answer: "Posting a question is for general legal inquiries where you seek advice or information. Creating a case is for specific legal matters that require ongoing legal representation and case management. Cases involve more detailed documentation and formal legal processes."
    },
    {
      id: 14,
      question: "How do I track my case progress?",
      answer: "You can track your case progress by navigating to 'My Cases' section. Each case shows its current status, updates, and any documents or communications related to it. You'll also receive notifications for important case updates."
    },
    {
      id: 15,
      question: "Can I get a refund if I'm not satisfied with the service?",
      answer: "Refund policies vary depending on the type of service and the specific terms agreed upon. Please review the terms and conditions before making a payment. For refund requests, contact our support team through the Help & Support section."
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      // If clicking the same FAQ, close it
      setOpenIndex(null);
    } else {
      // Otherwise, open the clicked FAQ
      setOpenIndex(index);
    }
  };

  return (
    <div className="help-support-container">
      <div className="container-fluid help-support-wrapper">
        {/* Header Section */}
        <div className="row mb-5" data-aos="fade-up">
          <div className="col-12">
            <div className="help-support-header text-center">
              <h1 className="help-support-title mb-3">Help & Support</h1>
              <p className="help-support-subtitle">
                Find answers to frequently asked questions and get the support you need
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row mb-5" data-aos="fade-up" data-aos-delay="100">
          <div className="col-12 col-md-8 offset-md-2">
            <div className="help-search-container">
              <i className="bi bi-search help-search-icon"></i>
              <input
                type="text"
                className="help-search-input"
                placeholder="Search for questions or topics..."
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1">
            <div className="faq-section">
              <h2 className="faq-section-title mb-4" data-aos="fade-up" data-aos-delay="200">
                Frequently Asked Questions
              </h2>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`faq-item ${openIndex === index ? "active" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="faq-question-content">
                        <h3 className="faq-question-text">{faq.question}</h3>
                        <i
                          className={`bi ${
                            openIndex === index
                              ? "bi-chevron-up"
                              : "bi-chevron-down"
                          } faq-chevron`}
                        ></i>
                      </div>
                    </div>
                    <div
                      className={`faq-answer ${openIndex === index ? "show" : ""}`}
                    >
                      <p className="faq-answer-text">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="row mt-5" data-aos="fade-up" data-aos-delay="800">
          <div className="col-12 col-md-8 offset-md-2">
            <div className="contact-support-card">
              <div className="contact-support-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h3 className="contact-support-title">Still need help?</h3>
              <p className="contact-support-text">
                If you can't find the answer you're looking for, our support team is here to help.
              </p>
              <button className="contact-support-button">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;

