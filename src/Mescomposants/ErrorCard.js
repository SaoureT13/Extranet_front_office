import React from 'react';

const ErrorCard = ({ statusCode, imagePath, message, buttonText, buttonLink }) => {
  return (
    <div className="card-body py-15 py-lg-20 text-center flex-column">
      {statusCode && (
        <h1 className="fw-bolder fs-2qx text-gray-900 mb-4">Erreur {statusCode}</h1>
      )}
      {message && <p>{message}</p>}
      {imagePath && (
        <img src={imagePath} width={400} className='mx-auto' alt="Erreur" />
      )}
      {buttonText && buttonLink && (
        <a href={buttonLink} className="btn btn-primary mt-4 mx-auto d-block">
          {buttonText}
        </a>
      )}
    </div>
  );
};

export default ErrorCard;
