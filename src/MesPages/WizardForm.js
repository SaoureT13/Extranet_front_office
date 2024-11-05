import React, { useState } from "react";
import './WizardForm.css'; // Add your custom styles if necessary

const WizardForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    socialID: "",
    name: "",
    birthDate: "",
    birthPlace: "",
    address: "",
    zipCode: "",
    gender: "",
    profilePicture: null,
    phoneNumber: "",
    paymentMethod: "",
    deliveryOption: "",
    clientType: "",
    codeNaf: "",
    exonereAirs: "",
    villeFacturation: "",
    adresseLivraison: "",
    telephoneSociete: "",
    cniGerant: null,
    dfe: null,
    rccm: null,
    planLocalisation: null,
    attestationAirs: null,

    STR_SOCMAIL: "",
    STR_SOCPHONE: "",
    STR_SOCNAME: "",
    STR_SOCSIRET: "",
    STR_SOCDESCRIPTION:'',
    LG_LSTPAYID:'0000000000000000000000000000000000000555',
    LG_LSTTYPESOCID:'0000000000000000000000000000000000000781',
    STR_UTITOKEN: "1,1mm", // New field
    mode: "registerClient", // New field
    documents: [
      {
        STR_DOCNAME: "Photo",
        LG_LSTID: "0000000000000000000000000000000000000781",
        file: null, // File for photo
      },
      {
        STR_DOCNAME: "PDF",
        LG_LSTID: "0000000000000000000000000000000000000781",
        file: null, // File for PDF
      },
    ],
    STR_SOCCODE: "111111", // New field
    STR_UTIFIRSTLASTNAME: "ZexolMibar", // New field
    STR_UTIPHONE: "0612540987", // New field
    STR_UTIMAIL: "zexol.mibar@gmail.com", // New field
    STR_UTILOGIN: "Zexol55", // New field
    STR_UTIPASSWORD: "JpT3sz8QxF", // New field
    LG_PROID: "13121523295256267666", // New field
    STR_SOCLOGO: null, // File for logo
    STR_UTIPIC: null, // File for profile picture
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('documents')) {
      const [_, index, field] = name.split('[');
      const docIndex = parseInt(index);
      const docField = field.replace(']', '');
      setFormData((prevData) => {
        const newDocs = [...prevData.documents];
        newDocs[docIndex][docField] = value;
        return { ...prevData, documents: newDocs };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    if (name.includes('documents')) {
      const [_, index, field] = name.split('[');
      const docIndex = parseInt(index);
      setFormData((prevData) => {
        const newDocs = [...prevData.documents];
        newDocs[docIndex][field.replace(']', '')] = e.target.files[0];
        return { ...prevData, documents: newDocs };
      });
    } else {
      setFormData({ ...formData, [name]: e.target.files[0] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", formData);
  };

  return (
    <div className="wizard-container">
      <h2 className="text-center">Personal Information</h2>
      <div className="progress-bar my-4 d-flex justify-content-between">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>4</div>
        <div className={`step ${step >= 5 ? "active" : ""}`}>5</div> {/* Nouvelle étape */}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <p className="mb-4">Please, fill in your personal information</p>
            <div className="row mb-9 p-5">
              <div className="col-lg-12 pr-lg-4 mb-4">
                <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                  Étape 1
                </h3>
                <p>Information générale sur le client</p>
                <div className="row gutter-sm">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Vous êtes* :</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="clientType"
                          value="cabinet veterinaire"
                          checked={formData.clientType === 'cabinet veterinaire'}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label">
                          Un cabinet vétérinaire
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="clientType"
                          value="pharmacie"
                          checked={formData.clientType === 'pharmacie'}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label">
                          Une Pharmacie
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step mt-5">
            <p>Information générale sur le client</p>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Libellé Client (Nom commercial) *</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    name="STR_SOCNAME"
                    value={formData.STR_SOCNAME}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row gutter-sm">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Siret (NCC) *</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    name="STR_SOCSIRET"
                    value={formData.STR_SOCSIRET}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Code NAF (Régime fiscal) *</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    name="code-naf"
                    value={formData.codeNaf}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Êtes-vous exonéré d'AIRSI ? *</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exonere-airs"
                        value="oui"
                        checked={formData.exonereAirs === "oui"}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label">Oui</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exonere-airs"
                        value="non"
                        checked={formData.exonereAirs === "non"}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label">Non</label>
                    </div>
                  </div>
                  <small className="form-text text-muted">
                    Seuls les structures affectées au Régime du Réel Normal d’imposition (RNI) ou au Régime du Réel simplifié d’imposition (RSI) sont exonérées d'AIRSI.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step mt-5">
            <p>Vos informations de contact</p>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Numéro de téléphone de l'entreprise *</label>
                  <input
                    type="tel"
                    className="form-control form-control-md"
                    name="telephoneSociete"
                    value={formData.telephoneSociete}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Adresse de facturation *</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    name="villeFacturation"
                    value={formData.villeFacturation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step mt-5">
            <p>Documents d'identité</p>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Photo de profil *</label>
                  <input
                    type="file"
                    className="form-control"
                    name="profilePicture"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
            </div>
            {formData.documents.map((doc, index) => (
              <div key={index} className="row gutter-sm">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>{doc.STR_DOCNAME}</label>
                    <input
                      type="file"
                      className="form-control"
                      name={`documents[${index}].file`}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="form-step mt-5">
            <p>Finalisez votre inscription</p>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Numéro de téléphone de contact *</label>
                  <input
                    type="tel"
                    className="form-control form-control-md"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row gutter-sm">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control form-control-md"
                    name="STR_UTIMAIL"
                    value={formData.STR_UTIMAIL}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row gutter-sm">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Nom d'utilisateur *</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    name="STR_UTILOGIN"
                    value={formData.STR_UTILOGIN}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Mot de passe *</label>
                  <input
                    type="password"
                    className="form-control form-control-md"
                    name="STR_UTIPASSWORD"
                    value={formData.STR_UTIPASSWORD}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
        <div className="form-step">
            <h3 className="title">Step 5: Résumé des informations</h3>
            <div>
            <p><strong>Client Type :</strong> {formData.clientType}</p>
            <p><strong>Libellé Client :</strong> {formData.STR_SOCNAME}</p>
            <p><strong>Siret :</strong> {formData.STR_SOCSIRET}</p>
            <p><strong>Code NAF :</strong> {formData.codeNaf}</p>
            <p><strong>Exonéré d'AIRSI :</strong> {formData.exonereAirs}</p>
            <p><strong>Ville de Facturation :</strong> {formData.villeFacturation}</p>
            <p><strong>Adresse de Livraison :</strong> {formData.adresseLivraison}</p>
            <p><strong>Email :</strong> {formData.STR_UTIMAIL}</p>
            <p><strong>Téléphone Société :</strong> {formData.telephoneSociete || formData.STR_SOCPHONE}</p>
            <p><strong>Téléphone Utilisateur :</strong> {formData.STR_UTIPHONE}</p>
            <p><strong>Nom Utilisateur :</strong> {formData.STR_UTIFIRSTLASTNAME}</p>
            <p><strong>Date de Naissance :</strong> {formData.birthDate}</p>
            <p><strong>Lieu de Naissance :</strong> {formData.birthPlace}</p>
            <p><strong>Adresse :</strong> {formData.address}, {formData.zipCode}</p>
            {/* You can display more fields here based on formData */}
            <p><strong>Documents :</strong></p>
            <ul>
                {formData.cniGerant && <li>CNI gérant: {formData.cniGerant.name}</li>}
                {formData.dfe && <li>DFE: {formData.dfe.name}</li>}
                {formData.rccm && <li>RCCM: {formData.rccm.name}</li>}
                {formData.planLocalisation && <li>Plan de localisation: {formData.planLocalisation.name}</li>}
                {formData.attestationAirs && <li>Attestation AIRSI: {formData.attestationAirs.name}</li>}
                {formData.documents.map((doc, index) => (
                doc.file && <li key={index}>{doc.STR_DOCNAME}: {doc.file.name}</li>
                ))}
            </ul>
            </div>
        </div>
)}


        {/* <div className="form-navigation">
          {step > 1 && <button type="button" className="btn btn-secondary" onClick={prevStep}>Précédent</button>}
          {step < 5 && <button type="button" className="btn btn-primary" onClick={nextStep}>Suivant</button>}
          {step === 5 && <button type="submit" className="btn btn-success">Soumettre</button>}
        </div> */}

    <div className="cart-action mb-6">
          {step > 1 && (
            <button type="button" 
            className="btn btn-dark btn-rounded btn-icon-left btn-shopping mr-auto"
            onClick={prevStep}>
                <i class="w-icon-long-arrow-left"></i>
              Précédent
            </button>
          )}
          {step < 5 ? (
            <button type="button"
            className="btn btn-dark btn-rounded btn-icon-left btn-shopping"
            onClick={nextStep}>
              Suivant
            </button>
          ) : (
            <button type="submit"
            className="btn btn-success btn-rounded btn-icon-left btn-shopping" >
              Soumettre
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WizardForm;
