import React from 'react';

interface DisclaimerProps {
  className?: string;
  showIcon?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`usa-alert usa-alert--warning ${className}`.trim()}>
      <div className="usa-alert__body">
        {showIcon && (
          <h3 className="usa-alert__heading">
            <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use xlinkHref="#alert-triangle" />
            </svg>
            Important Disclaimer
          </h3>
        )}
        {!showIcon && <h3 className="usa-alert__heading">Important Disclaimer</h3>}
        <p className="usa-alert__text">
          This tool provides estimates only and is not legal advice. Results are not binding and
          should not be used for court purposes. Consult an attorney or the official Georgia
          Child Support Calculator for legal matters.
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
