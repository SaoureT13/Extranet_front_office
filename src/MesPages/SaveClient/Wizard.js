import React, { useEffect, useState } from "react";
import "./Wizard.css"; // Add custom CSS for styling
import {
    adminEmail,
    convertToFormData,
    crudData,
} from "../../services/apiService";
import { ToastContainer, toast } from "react-toastify";
import FileUploader from "../../Mescomposants/FileUploader/FileUploader";
import { useNavigate } from "react-router-dom";

const WizardForm = () => {
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
        STR_CNI: "",
        STR_DFE: "",
        STR_RCCM: "",
        STR_PLANLOCALISATION: "",
        STR_AIRSI: "",

        documents: [],
        mode: "registerClient",

        LG_PROID: 3,
        LG_LSTPAYID: "",
        LG_LSTTYPESOCID: "",
        STR_SOCDESCRIPTION: "",
        STR_SOCMAIL: "",
        STR_SOCPHONE: "",
        STR_SOCSIRET: "",
        STR_SOCNAME: "",
        STR_SOCCODE: "",

        STR_UTIPASSWORD: "",
        STR_UTILOGIN: "",
        STR_UTIMAIL: "",
        STR_UTIPHONE: "",
        STR_UTIFIRSTLASTNAME: "",
    });

    useEffect(() => {
        let isRequestSent = false;

        if (success === true) {
            if (!isRequestSent) {
                const payload = {
                    mode: "sendEmail",
                    LG_LSTID: "MSG_ACCOUNT_CREATION",
                    TO: adminEmail,
                };
                try {
                    crudData(payload, "ConfigurationManager.php").then(
                        (response) => {
                            const { desc_statut, code_statut } = response.data;
                            if (code_statut !== "0") {
                                console.log("error");
                            }
                            isRequestSent = true;
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }, [success]);

    useEffect(() => {
        const params = {
            mode: mode.listElementsMode,
            LG_TYLID: "3",
        };
        crudData(params, "ConfigurationManager.php")
            .then((response) => {
                setCountries(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return formData.LG_LSTTYPESOCID !== ""; // Add more validations as needed
            case 2:
                return (
                    formData.STR_SOCSIRET !== "" &&
                    formData.STR_SOCNAME !== "" &&
                    formData.STR_SOCCODE !== ""
                ); // Add more validations as needed
            case 3:
                return (
                    formData.LG_LSTPAYID !== "" &&
                    formData.STR_SOCMAIL !== "" &&
                    formData.STR_SOCPHONE !== ""
                ); // Add more validations as needed
            case 4:
                return (
                    formData.STR_UTIPASSWORD !== "" &&
                    formData.STR_UTILOGIN !== "" &&
                    formData.STR_UTIFIRSTLASTNAME !== "" &&
                    formData.STR_UTIPHONE !== "" &&
                    formData.STR_UTIMAIL
                ); // Add more validations as needed
            case 5:
                return (
                    formData.STR_CNI !== "" &&
                    formData.STR_DFE !== "" &&
                    formData.STR_RCCM !== "" &&
                    formData.STR_PLANLOCALISATION !== "" &&
                    formData.STR_AIRSI !== ""
                ); // Add more validations as needed
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = "ConfigurationManager.php";
        console.log(formData);
        // Afficher le loader
        // Convert dates and times to the desired format
        try {
            setLoading(true);
            crudData(convertToFormData(formData), apiUrl)
                .then((response) => {
                    const { desc_statut, code_statut } = response.data; // Extraction des informations de la réponse de l'API
                    if (code_statut === "1") {
                        // Vérification si l'opération a réussi
                        //Affichage d'une notification de succès
                        toast.success(desc_statut, {
                            position: "top-center",
                            autoClose: 3000,
                        });
                        setSuccess(true);

                        setTimeout(() => {
                            navigate("/");
                        }, 5000);
                        // resetForm()
                    } else {
                        toast.error(desc_statut, {
                            position: "top-center",
                            autoClose: 3000,
                        }); // Afficher une notification de succès
                        //navigate(paths.signIn);

                        // Affichage d'une notification d'erreur
                    }
                })
                .catch((error) => {
                    console.error(
                        "Erreur lors de la récupération des données:",
                        error
                    );
                })
                .finally(
                    () => {
                        setLoading(false);
                    } // Cacher le loader
                );
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire:", error);
        }
    };

    const nextStep = () => {
        console.log(formData);
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
        } else {
            const stepError =
                currentStep === 5
                    ? "Veuillez fournir tous les documents demandés sur cette page"
                    : "Veuillez remplir tous les champs obligatoires.";
            toast.error(stepError, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BiodataStep
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            case 2:
                return (
                    <AddressStep
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            case 3:
                return (
                    <AccountStep
                        formData={formData}
                        setFormData={setFormData}
                        countries={countries}
                    />
                );
            case 4:
                return (
                    <UserStep formData={formData} setFormData={setFormData} />
                );
            case 5:
                return (
                    <SocialStep formData={formData} setFormData={setFormData} />
                );
            case 6:
                return (
                    <Summary
                        formData={formData}
                        setFormData={setFormData}
                        countries={countries}
                    />
                );
            default:
                return <Finish formData={formData} setFormData={setFormData} />;
        }
    };

    return (
        <div className="wizard-container">
            <ToastContainer />
            <div className="steps-header">
                <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                    <i className="fa fa-user"></i>
                    {/* <span>Biodata</span> */}
                </div>
                <div
                    className={`step-line ${currentStep >= 2 ? "active" : ""}`}
                ></div>
                <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                    <i className="fa fa-home"></i>
                    {/* <span>Alamat</span> */}
                </div>
                <div
                    className={`step-line ${currentStep >= 3 ? "active" : ""}`}
                ></div>
                <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                    <i className="fa fa-map"></i>
                    {/* <span>Akun</span> */}
                </div>
                <div
                    className={`step-line ${currentStep >= 4 ? "active" : ""}`}
                ></div>
                <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                    <i className="fa fa-key"></i>
                    {/* <span>Akun</span> */}
                </div>
                <div
                    className={`step-line ${currentStep >= 5 ? "active" : ""}`}
                ></div>
                <div className={`step ${currentStep >= 5 ? "active" : ""}`}>
                    <i className="fa fa-file"></i>
                    {/* <span>Sosial</span> */}
                </div>
                <div
                    className={`step-line ${currentStep === 6 ? "active" : ""}`}
                ></div>
                <div className={`step ${currentStep === 6 ? "active" : ""}`}>
                    <i className="fa fa-address-book"></i>
                    {/* <span>Sosial</span> */}
                </div>
            </div>

            <div className="step-content">
                {success ? <Finish /> : renderStepContent()}
            </div>

            <div class="row gutter-sm">
                {!success && (
                    <div className="text-right ">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-dark btn-rounded mx-2"
                            >
                                Précédent
                            </button>
                        )}
                        {currentStep < 6 ? (
                            <button
                                onClick={nextStep}
                                className="btn btn-dark btn-rounded  mx-2"
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="d-flex align-items-center justify-content-center btn btn-success  btn-rounded "
                            >
                                Enregistrer
                                {loading && <div class="loader ml-4"></div>}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Step Components (Biodata, Alamat, Akun, Sosial)
const BiodataStep = ({ nextStep, formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <p class="text-center">
                Nous sommes là pour vous accompagner efficacement dans le choix
                et la commande de vos produits.
            </p>
            <div className="radio-group w-80 mx-auto">
                <div>
                    <label
                        className={`radio-item ${
                            formData.LG_LSTTYPESOCID ===
                            "0000000000000000000000000000000000000787"
                                ? "active"
                                : ""
                        }`}
                    >
                        <input
                            className="form-check-input"
                            type="radio"
                            id="cabinet_veterinaire"
                            name="LG_LSTTYPESOCID"
                            value="0000000000000000000000000000000000000787"
                            checked={
                                formData.LG_LSTTYPESOCID ===
                                "0000000000000000000000000000000000000787"
                            }
                            onChange={handleChange}
                            required
                        />
                        <img
                            src="assets/images/image_footer.png"
                            class="w-100"
                            alt="Cabinet Vétérinaire"
                        />
                        Un cabinet vétérinaire
                    </label>
                </div>

                <div>
                    <label
                        htmlFor="pharmacie"
                        className={`radio-item ${
                            formData.LG_LSTTYPESOCID ===
                            "0000000000000000000000000000000000000788"
                                ? "active"
                                : ""
                        }`}
                    >
                        <input
                            className="form-check-input"
                            type="radio"
                            id="pharmacie"
                            name="LG_LSTTYPESOCID"
                            value="0000000000000000000000000000000000000788"
                            checked={
                                formData.LG_LSTTYPESOCID ===
                                "0000000000000000000000000000000000000788"
                            }
                            onChange={handleChange}
                            required
                        />
                        <img
                            src="assets/images/image_footer.png"
                            class="w-100"
                            alt="Pharmacie"
                        />
                        Une Pharmacie
                    </label>
                </div>

                <div>
                    <label
                        htmlFor="scociete"
                        className={`radio-item ${
                            formData.LG_LSTTYPESOCID ===
                            "0000000000000000000000000000000000000789"
                                ? "active"
                                : ""
                        }`}
                    >
                        <input
                            className="form-check-input"
                            type="radio"
                            id="scociete"
                            name="LG_LSTTYPESOCID"
                            value="0000000000000000000000000000000000000789"
                            checked={
                                formData.LG_LSTTYPESOCID ===
                                "0000000000000000000000000000000000000789"
                            }
                            onChange={handleChange}
                            required
                        />
                        <img
                            src="assets/images/image_footer.png"
                            class="w-100"
                            alt="Société"
                        />
                        Société
                    </label>
                </div>
            </div>
        </>
    );
};

const AddressStep = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="page-content cart">
            <div className="container">
                <form className="form checkout-form" action="#" method="post">
                    <div className="row mb-0">
                        <div className="col-lg-12 pr-lg-4 mb-4">
                            <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                                Information générale sur le client
                            </h3>
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="row gutter-sm">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>
                                                    Libellé Client (Nom
                                                    commercial) *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="STR_SOCNAME"
                                                    value={
                                                        formData[
                                                            "STR_SOCNAME"
                                                        ] || ""
                                                    }
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
                                                    value={
                                                        formData.STR_SOCSIRET ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    Code NAF (Régime fiscal) *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="STR_SOCCODE"
                                                    value={
                                                        formData[
                                                            "STR_SOCCODE"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 mb-4 sticky-sidebar-wrapper">
                                    <div className="pin-wrapper">
                                        <div className="order-summary-wrapper sticky-sidebar">
                                            <div className="order-summary">
                                                <div
                                                    className="payment-methods"
                                                    id="payment_method"
                                                >
                                                    <h4 className="title font-weight-bold ls-25 pb-0 mb-1">
                                                        Êtes-vous exonéré
                                                        d'AIRSI ?
                                                    </h4>
                                                    <div className="radio-group w-100 mx-auto">
                                                        <div>
                                                            <label
                                                                htmlFor="Oui"
                                                                className={`radio-item ${
                                                                    formData.LG_LSTTYPESOCID ===
                                                                    "0000000000000000000000000000000000000787"
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="Oui"
                                                                    name="LG_LSTTYPESOCID"
                                                                    value="0000000000000000000000000000000000000787"
                                                                    checked={
                                                                        formData.LG_LSTTYPESOCID ===
                                                                        "0000000000000000000000000000000000000787"
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                                <img
                                                                    src="assets/images/image_footer.png"
                                                                    class="w-100"
                                                                />
                                                                Oui
                                                            </label>
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor="Non"
                                                                className={`radio-item ${
                                                                    formData.LG_LSTTYPESOCID ===
                                                                    "0000000000000000000000000000000000000788"
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="Non"
                                                                    name="LG_LSTTYPESOCID"
                                                                    value="0000000000000000000000000000000000000788"
                                                                    checked={
                                                                        formData.LG_LSTTYPESOCID ===
                                                                        "0000000000000000000000000000000000000788"
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                                <img
                                                                    src="assets/images/image_footer.png"
                                                                    class="w-100"
                                                                />
                                                                Non
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <small class="form-text text-muted">
                                                        Seuls les structures
                                                        affectées au Régime du
                                                        Réel Normal d’imposition
                                                        (RNI) ou au Régime du
                                                        Réel simplifié
                                                        d’imposition (RSI) sont
                                                        exonérées d'AIRSI.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AccountStep = ({ formData, setFormData, countries }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <div className="page-content cart">
            <div className="container">
                <form className="form checkout-form" action="#" method="post">
                    <div className="row mb-9">
                        <div className="col-lg-12 pr-lg-4 mb-4">
                            <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                                Information de facturation et livraison
                            </h3>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row gutter-sm">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>
                                                    Ville de Facturation *
                                                </label>
                                                {/* <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="LG_LSTPAYID"
                                                    value={
                                                        formData[
                                                            "LG_LSTPAYID"
                                                        ] || ""
                                                    }
                                                    o
                                                    required
                                                /> */}
                                                <select
                                                    name="LG_LSTPAYID"
                                                    className="form-control form-control-md"
                                                    value={
                                                        formData[
                                                            "LG_LSTPAYID"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {countries.map(
                                                        (country) => (
                                                            <option
                                                                key={
                                                                    country.LG_LSTID
                                                                }
                                                                value={
                                                                    country.LG_LSTID
                                                                }
                                                            >
                                                                {
                                                                    country.STR_LSTDESCRIPTION
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    Adresse de livraison *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="adresse-livraison"
                                                    value={
                                                        formData[
                                                            "adresse-livraison"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="row gutter-sm">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Adresse E-mail *</label>
                                                <input
                                                    type="STR_SOCMAIL"
                                                    className="form-control form-control-md"
                                                    name="STR_SOCMAIL"
                                                    value={
                                                        formData.STR_SOCMAIL ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    Téléphone Société *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="STR_SOCPHONE"
                                                    value={
                                                        formData[
                                                            "STR_SOCPHONE"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserStep = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <div className="page-content cart">
            <div className="container">
                <form className="form checkout-form" action="#" method="post">
                    <div className="row mb-9">
                        <div className="col-lg-12 pr-lg-4 mb-4">
                            <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                                Information de l'utilisateur
                            </h3>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row gutter-sm">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>
                                                    Non et prenom de
                                                    l'utilisateur *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="STR_UTIFIRSTLASTNAME"
                                                    value={
                                                        formData[
                                                            "STR_UTIFIRSTLASTNAME"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row gutter-sm">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    Téléphone utilisateur *
                                                </label>
                                                <input
                                                    type="STR_UTIPHONE"
                                                    className="form-control form-control-md"
                                                    name="STR_UTIPHONE"
                                                    value={
                                                        formData.STR_UTIPHONE ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Login *</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-md"
                                                    name="STR_UTILOGIN"
                                                    value={
                                                        formData[
                                                            "STR_UTILOGIN"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row gutter-sm">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    Email utilisateur *
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-md"
                                                    name="STR_UTIMAIL"
                                                    value={
                                                        formData[
                                                            "STR_UTIMAIL"
                                                        ] || ""
                                                    }
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
                                                    value={
                                                        formData[
                                                            "STR_UTIPASSWORD"
                                                        ] || ""
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SocialStep = ({ formData, setFormData }) => {
    // Initialize state arrays to store IDs and images
    const [documents, setDocuments] = useState([]);

    // Ensure formData is initialized with default values if it's undefined
    const initialFormData = {
        STR_CNI: "",
        STR_DFE: "",
        STR_RCCM: "",
        STR_PLANLOCALISATION: "",
        STR_AIRSI: "",
        documents: [],
        ...formData, // Spread in any existing formData to preserve it
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const imageUrl = URL.createObjectURL(files[0]);

            let newDocuments = [...documents];

            switch (name) {
                case "STR_CNI":
                    newDocuments.push({
                        file: files[0],
                        LG_LSTID: "0000000000000000000000000000000000000785",
                    });
                    setFormData((prevData) => ({
                        ...prevData,
                        STR_CNI: imageUrl,
                    }));
                    break;
                case "STR_DFE":
                    newDocuments.push({
                        file: files[0],
                        LG_LSTID: "0000000000000000000000000000000000000782",
                    });
                    setFormData((prevData) => ({
                        ...prevData,
                        STR_DFE: imageUrl,
                    }));
                    break;
                case "STR_RCCM":
                    newDocuments.push({
                        file: files[0],
                        LG_LSTID: "0000000000000000000000000000000000000783",
                    });
                    setFormData((prevData) => ({
                        ...prevData,
                        STR_RCCM: imageUrl,
                    }));
                    break;
                case "STR_PLANLOCALISATION":
                    newDocuments.push({
                        file: files[0],
                        LG_LSTID: "0000000000000000000000000000000000000784",
                    });
                    setFormData((prevData) => ({
                        ...prevData,
                        STR_PLANLOCALISATION: imageUrl,
                    }));
                    break;
                case "STR_AIRSI":
                    newDocuments.push({
                        file: files[0],
                        LG_LSTID: "0000000000000000000000000000000000000786",
                    });
                    setFormData((prevData) => ({
                        ...prevData,
                        STR_AIRSI: imageUrl,
                    }));
                    break;
                default:
                    break;
            }

            setDocuments(newDocuments);
            setFormData((prevData) => ({
                ...prevData,
                documents: newDocuments,
            }));
        }
    };

    const handleFileChange = (fieldName, file, LG_LSTID) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: URL.createObjectURL(file),
            [`${fieldName}_NAME`]: file.name,
            [`${fieldName}_TYPE`]: file.type,
            [`${fieldName}_SIZE`]: (file.size / (1024 * 1024)).toFixed(2),
        }));

        let newDocuments = [...documents];
        newDocuments.push({
            file: file,
            LG_LSTID: LG_LSTID,
        });
        console.log(newDocuments);
        setDocuments(newDocuments);
        setFormData((prevData) => ({
            ...prevData,
            documents: newDocuments,
        }));
    };

    return (
        <div className="container  mb-5">
            <div className="row p-5">
                <div className="col-lg-12 pr-lg-4 mb-4">
                    <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                        Étape 4
                    </h3>
                    <p>Télécharger les documents justificatifs</p>
                    <div className="row gutter-sm">
                        <div className="col-md-4">
                            <FileUploader
                                label={"CNI Gérant *"}
                                name={"STR_CNI"}
                                onChange={handleFileChange}
                                initialPreview={formData?.STR_CNI}
                                LG_LSTID={
                                    "0000000000000000000000000000000000000785"
                                }
                                initialFileName={formData?.STR_CNI_NAME}
                                initialFileSize={formData?.STR_CNI_SIZE}
                                initialFileType={formData?.STR_CNI_TYPE}
                            />
                        </div>
                        <div className="col-md-4">
                            <FileUploader
                                label={"DFE*"}
                                name={"STR_DFE"}
                                onChange={handleFileChange}
                                initialPreview={formData?.STR_DFE}
                                LG_LSTID={
                                    "0000000000000000000000000000000000000782"
                                }
                                initialFileName={formData?.STR_DFE_NAME}
                                initialFileSize={formData?.STR_DFE_SIZE}
                                initialFileType={formData?.STR_DFE_TYPE}
                            />
                        </div>
                        <div className="col-md-4">
                            <FileUploader
                                label={"RCCM*"}
                                name={"STR_RCCM"}
                                onChange={handleFileChange}
                                initialPreview={formData?.STR_RCCM}
                                LG_LSTID={
                                    "0000000000000000000000000000000000000783"
                                }
                                initialFileName={formData?.STR_RCCM_NAME}
                                initialFileSize={formData?.STR_RCCM_SIZE}
                                initialFileType={formData?.STR_RCCM_TYPE}
                            />
                        </div>
                        <div className="col-md-4">
                            <FileUploader
                                label={"Plan de localisation*"}
                                name={"STR_PLANLOCALISATION"}
                                onChange={handleFileChange}
                                initialPreview={formData?.STR_PLANLOCALISATION}
                                LG_LSTID={
                                    "0000000000000000000000000000000000000784"
                                }
                                initialFileName={
                                    formData?.STR_PLANLOCALISATION_NAME
                                }
                                initialFileSize={
                                    formData?.STR_PLANLOCALISATION_SIZE
                                }
                                initialFileType={
                                    formData?.STR_PLANLOCALISATION_TYPE
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <FileUploader
                                label={"Attestation d’exonération d’AIRSI*"}
                                name={"STR_AIRSI"}
                                onChange={handleFileChange}
                                initialPreview={formData?.STR_AIRSI}
                                LG_LSTID={
                                    "0000000000000000000000000000000000000786"
                                }
                                initialFileName={formData?.STR_AIRSI_NAME}
                                initialFileSize={formData?.STR_AIRSI_SIZE}
                                initialFileType={formData?.STR_AIRSI_TYPE}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Summary = ({ formData, countries }) => (
    <div className="container  mb-5">
        <div className="row p-5">
            <div className="col-lg-12 pr-lg-4 mb-4">
                <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                    Résumé
                </h3>
                <div className="row gutter-sm mb-4">
                    <div className="col-md-12">
                        <h4>Informations Générales</h4>
                        <ul>
                            <li>
                                <strong>Vous êtes :</strong>{" "}
                                {formData.clientType === "cabinet_veterinaire"
                                    ? "Un cabinet vétérinaire"
                                    : "Une Pharmacie"}
                            </li>
                            <li>
                                <strong>
                                    Libellé Client (Nom commercial):
                                </strong>{" "}
                                {formData?.STR_SOCNAME}
                            </li>
                            <li>
                                <strong>Siret (NCC):</strong>{" "}
                                {formData.STR_SOCSIRET}
                            </li>
                            <li>
                                <strong>Code NAF (Régime fiscal):</strong>{" "}
                                {formData.STR_SOCCODE}
                            </li>
                            <li>
                                <strong>Êtes-vous exonéré d'AIRSI ? :</strong>{" "}
                                {formData["exonere-airs"] === "oui"
                                    ? "Oui"
                                    : "Non"}
                            </li>
                            <li>
                                <strong>Ville de Facturation:</strong>{" "}
                                {/* {formData["ville-facturation"]} */}
                                {
                                    countries.find(
                                        (item) =>
                                            item.LG_LSTID ===
                                            formData.LG_LSTPAYID
                                    )?.STR_LSTDESCRIPTION
                                }
                            </li>
                            <li>
                                <strong>Adresse E-mail:</strong>{" "}
                                {formData.STR_SOCMAIL}
                            </li>
                            <li>
                                <strong>Téléphone Société:</strong>{" "}
                                {formData.STR_SOCPHONE}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row gutter-sm mb-4">
                    <div className="col-md-12">
                        <h4>Documents Téléchargés</h4>
                        <div className="row">
                            {formData["STR_CNI"] && (
                                <div className="col-lg-4 mb-3">
                                    <p>
                                        <strong>CNI gérant:</strong>
                                    </p>
                                    <img
                                        src={formData["STR_CNI"]}
                                        alt="CNI gérant"
                                        className="img-preview img-fluid"
                                    />
                                </div>
                            )}
                            {formData.STR_DFE && (
                                <div className="col-lg-4 mb-3">
                                    <p>
                                        <strong>DFE:</strong>
                                    </p>
                                    <img
                                        src={formData.STR_DFE}
                                        alt="DFE"
                                        className="img-preview img-fluid"
                                    />
                                </div>
                            )}
                            {formData.STR_RCCM && (
                                <div className="col-lg-4 mb-3">
                                    <p>
                                        {" "}
                                        <strong>RCCM:</strong>
                                    </p>
                                    <img
                                        src={formData.STR_RCCM}
                                        alt="RCCM"
                                        className="img-preview img-fluid"
                                    />
                                </div>
                            )}
                            {formData["STR_PLANLOCALISATION"] && (
                                <div className="col-lg-4 mb-3">
                                    <p>
                                        <strong>Plan de localisation:</strong>
                                    </p>
                                    <img
                                        src={formData["STR_PLANLOCALISATION"]}
                                        alt="Plan de localisation"
                                        className="img-preview img-fluid"
                                    />
                                </div>
                            )}
                            {formData["STR_AIRSI"] && (
                                <div className="col-lg-4 mb-3">
                                    <p>
                                        <strong>
                                            Attestation d’exonération d’AIRSI:
                                        </strong>
                                    </p>
                                    <img
                                        src={formData["STR_AIRSI"]}
                                        alt="Attestation d’exonération d’AIRSI"
                                        className="img-preview img-fluid"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Finish = () => {
    return (
        <div className="container  mb-5">
            <div className="row p-5" style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width={100}
                    >
                        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"></path>
                    </svg>
                </div>
                <p>
                    Votre demande a été soumise avec succès. Nous vous
                    contacterons sous peu.
                    <br />
                    Vous serez redirigé vers la page d'accueil dans quelques
                    secondes.
                </p>
            </div>
        </div>
    );
};

export default WizardForm;
