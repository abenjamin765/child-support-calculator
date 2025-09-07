import React from 'react';

interface DisclaimerProps {
  className?: string;
  showIcon?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', showIcon = true }) => {
  return (
    <div
      className={`usa-alert usa-alert--warning ${showIcon ? '' : 'usa-alert--no-icon'} ${className}`.trim()}
    >
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">Important Disclaimer</h4>
        <p className="usa-alert__text">
          This tool provides estimates only and is not legal advice. Results are not binding and
          should not be used for court purposes. Consult an attorney or the official Georgia Child
          Support Calculator for legal matters.
        </p>
        <p className="usa-alert__text">
          <a
            href="https://csc.georgiacourts.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="usa-link"
          >
            Visit Georgia Child Support Commission
          </a>
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
