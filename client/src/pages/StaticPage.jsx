import React from 'react';
import { Link } from 'react-router-dom';

const StaticPage = ({ title, is404 }) => {
    // You can fetch markdown or HTML content from an API for each static page
    const content = `This is placeholder content for the ${title} page. In a real application, you might fetch this from a CMS or a static file.`;

    return (
        <div className="max-w-3xl mx-auto py-12 prose dark:prose-invert">
            <h1>{title}</h1>
            <p>{content}</p>

            {is404 && (
                <div className="mt-8">
                    <p>It seems you've taken a wrong turn. Let's get you back on track.</p>
                    <Link to="/" className="btn-primary no-underline mt-4 inline-block">Go to Homepage</Link>
                </div>
            )}
        </div>
    );
};

export default StaticPage;
