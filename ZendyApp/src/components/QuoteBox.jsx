// QuoteCard component
import React from 'react';
import { FaQuoteLeft, FaSyncAlt } from 'react-icons/fa';

  const QuoteBox = ({ quote, fetchMotivationalQuote }) => (
    <div className="quote-container rounded-xl shadow-md p-6 text-white">
      <div className="flex items-start">
        <FaQuoteLeft className="text-white opacity-50 text-2xl mr-3 mt-1" />
        <div>
          <p id="quote-text" className="text-lg font-medium">{quote.text}</p>
          <p id="quote-author" className="text-right text-sm opacity-80 mt-2">- {quote.author}</p>
        </div>
      </div>
      <button
        id="new-quote-btn"
        className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
        onClick={fetchMotivationalQuote}
      >
        <FaSyncAlt className="mr-2 inline" /> New Quote
      </button>
    </div>
  );

export default QuoteBox;