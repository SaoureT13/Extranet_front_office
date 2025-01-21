// src/components/Accueil.js
import React, { useState, useEffect, useContext } from "react"; // Importation de React et des hooks useState et useEffect
// import AppMenu from '../Mescomposants/AppMenu'
// import LoadExternalScriptsDashboard from '../GlobalImport/LoadExternalScriptsDashboard'

import TopBar from "../Mescomposants/Header/TopBar";
import MobileMenu from "../Mescomposants/MobileMenu";
import Footer from "../Mescomposants/Footer";
import ProductGallery from "../Mescomposants/ProductGallery";
import ProductSideBar from "../Mescomposants/ProductSideBar";
import PhotoSwipe from "../Mescomposants/PhotoSwipe";

import { useNavigate } from "react-router-dom";
import { crudData } from "../services/apiService"; // Importation de la fonction crudData

// import './css/bootstrap.min.css';
// import './css/custom.min.css';
// import './css/app.css';
// import './css/style.min.css';

import AppMenu from "./AppMenu";

const Form = () => {
    return (
        <>
            <>
                <div className="page-wrapper">
                    {/* Start of Header */}
                    <TopBar />
                    {/* End of Header */}
                    {/* Start of Main */}
                    <main className="dashboard-main main mb-0 pb-1">
                        {/* Start of Breadcrumb */}

                        {/* End of Breadcrumb */}
                        {/* Start of Page Content */}
                        <div className="page-content pt-0">
                            <div className="container pt-5">
                                <div id="layout-wrapper">
                                    {/* <TopBar />
        
        <AppMenu /> */}
                                    <AppMenu />
                                    <div className="main-content m-0">
                                        <div className="page-content pt-0">
                                            <div className="container-fluid pt-5">
                                                {/* start page title */}
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                                            <h4 className="mb-sm-0">
                                                                Wizard
                                                            </h4>
                                                            <div className="page-title-right">
                                                                <ol className="breadcrumb m-0">
                                                                    <li className="breadcrumb-item">
                                                                        <a href="javascript: void(0);">
                                                                            Forms
                                                                        </a>
                                                                    </li>
                                                                    <li className="breadcrumb-item active">
                                                                        Wizard
                                                                    </li>
                                                                </ol>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* end page title */}
                                                <div className="row">
                                                    <div className="col-xl-6">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4 className="card-title mb-0">
                                                                    Progress Nav
                                                                    Steps
                                                                </h4>
                                                            </div>
                                                            {/* end card header */}
                                                            <div className="card-body">
                                                                <form
                                                                    action="#"
                                                                    className="form-steps"
                                                                    autoComplete="off"
                                                                >
                                                                    <div className="text-center pt-3 pb-4 mb-1">
                                                                        <h5>
                                                                            Signup
                                                                            Your
                                                                            Account
                                                                        </h5>
                                                                    </div>
                                                                    <div
                                                                        id="custom-progress-bar"
                                                                        className="progress-nav mb-4"
                                                                    >
                                                                        <div
                                                                            className="progress"
                                                                            style={{
                                                                                height: 1,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="progress-bar"
                                                                                role="progressbar"
                                                                                style={{
                                                                                    width: "0%",
                                                                                }}
                                                                                aria-valuenow={
                                                                                    0
                                                                                }
                                                                                aria-valuemin={
                                                                                    0
                                                                                }
                                                                                aria-valuemax={
                                                                                    100
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <ul
                                                                            className="nav nav-pills progress-bar-tab custom-nav"
                                                                            role="tablist"
                                                                        >
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link rounded-pill active"
                                                                                    data-progressbar="custom-progress-bar"
                                                                                    id="pills-gen-info-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#pills-gen-info"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="pills-gen-info"
                                                                                    aria-selected="true"
                                                                                    data-position={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    1
                                                                                </button>
                                                                            </li>
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link rounded-pill"
                                                                                    data-progressbar="custom-progress-bar"
                                                                                    id="pills-info-desc-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#pills-info-desc"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="pills-info-desc"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        1
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    2
                                                                                </button>
                                                                            </li>
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link rounded-pill"
                                                                                    data-progressbar="custom-progress-bar"
                                                                                    id="pills-success-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#pills-success"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="pills-success"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        2
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    3
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="tab-content">
                                                                        <div
                                                                            className="tab-pane fade show active"
                                                                            id="pills-gen-info"
                                                                            role="tabpanel"
                                                                            aria-labelledby="pills-gen-info-tab"
                                                                        >
                                                                            <div>
                                                                                <div className="mb-4">
                                                                                    <div>
                                                                                        <h5 className="mb-1">
                                                                                            General
                                                                                            Information
                                                                                        </h5>
                                                                                        <p className="text-muted">
                                                                                            Fill
                                                                                            all
                                                                                            Information
                                                                                            as
                                                                                            below
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="gen-info-email-input"
                                                                                            >
                                                                                                Email
                                                                                            </label>
                                                                                            <input
                                                                                                type="email"
                                                                                                className="form-control"
                                                                                                id="gen-info-email-input"
                                                                                                placeholder="Enter email"
                                                                                                required=""
                                                                                            />
                                                                                            <div className="invalid-feedback">
                                                                                                Please
                                                                                                enter
                                                                                                an
                                                                                                email
                                                                                                address
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="gen-info-username-input"
                                                                                            >
                                                                                                User
                                                                                                Name
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                id="gen-info-username-input"
                                                                                                placeholder="Enter user name"
                                                                                                required=""
                                                                                            />
                                                                                            <div className="invalid-feedback">
                                                                                                Please
                                                                                                enter
                                                                                                a
                                                                                                user
                                                                                                name
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        className="form-label"
                                                                                        htmlFor="gen-info-password-input"
                                                                                    >
                                                                                        Password
                                                                                    </label>
                                                                                    <input
                                                                                        type="password"
                                                                                        className="form-control"
                                                                                        id="gen-info-password-input"
                                                                                        placeholder="Enter Password"
                                                                                        required=""
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        Please
                                                                                        enter
                                                                                        a
                                                                                        password
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                    data-nexttab="pills-info-desc-tab"
                                                                                >
                                                                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                    Go
                                                                                    to
                                                                                    more
                                                                                    info
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                        <div
                                                                            className="tab-pane fade"
                                                                            id="pills-info-desc"
                                                                            role="tabpanel"
                                                                            aria-labelledby="pills-info-desc-tab"
                                                                        >
                                                                            <div>
                                                                                <div className="text-center">
                                                                                    <div className="profile-user position-relative d-inline-block mx-auto mb-2">
                                                                                        <img
                                                                                            src="assets/images/users/user-dummy-img.jpg"
                                                                                            className="rounded-circle avatar-lg img-thumbnail user-profile-image"
                                                                                            alt="user-profile-image"
                                                                                        />
                                                                                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                                                            <input
                                                                                                id="profile-img-file-input"
                                                                                                type="file"
                                                                                                className="profile-img-file-input"
                                                                                                accept="image/png, image/jpeg"
                                                                                            />
                                                                                            <label
                                                                                                htmlFor="profile-img-file-input"
                                                                                                className="profile-photo-edit avatar-xs"
                                                                                            >
                                                                                                <span className="avatar-title rounded-circle bg-light text-body">
                                                                                                    <i className="ri-camera-fill" />
                                                                                                </span>
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <h5 className="fs-14">
                                                                                        Add
                                                                                        Image
                                                                                    </h5>
                                                                                </div>
                                                                                <div>
                                                                                    <label
                                                                                        className="form-label"
                                                                                        htmlFor="gen-info-description-input"
                                                                                    >
                                                                                        Description
                                                                                    </label>
                                                                                    <textarea
                                                                                        className="form-control"
                                                                                        placeholder="Enter Description"
                                                                                        id="gen-info-description-input"
                                                                                        rows={
                                                                                            2
                                                                                        }
                                                                                        required=""
                                                                                        defaultValue={
                                                                                            ""
                                                                                        }
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        Please
                                                                                        enter
                                                                                        a
                                                                                        description
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link text-decoration-none btn-label previestab"
                                                                                    data-previous="pills-gen-info-tab"
                                                                                >
                                                                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                                                                    Back
                                                                                    to
                                                                                    General
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                    data-nexttab="pills-success-tab"
                                                                                >
                                                                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                    Submit
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                        <div
                                                                            className="tab-pane fade"
                                                                            id="pills-success"
                                                                            role="tabpanel"
                                                                            aria-labelledby="pills-success-tab"
                                                                        >
                                                                            <div>
                                                                                <div className="text-center">
                                                                                    <div className="mb-4">
                                                                                        <lord-icon
                                                                                            src="../../../../cdn.lordicon.com/lupuorrc.json"
                                                                                            trigger="loop"
                                                                                            colors="primary:#0ab39c,secondary:#405189"
                                                                                            style={{
                                                                                                width: 120,
                                                                                                height: 120,
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <h5>
                                                                                        Well
                                                                                        Done
                                                                                        !
                                                                                    </h5>
                                                                                    <p className="text-muted">
                                                                                        You
                                                                                        have
                                                                                        Successfully
                                                                                        Signed
                                                                                        Up
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                    </div>
                                                                    {/* end tab content */}
                                                                </form>
                                                            </div>
                                                            {/* end card body */}
                                                        </div>
                                                        {/* end card */}
                                                    </div>
                                                    {/* end col */}
                                                    <div className="col-xl-6">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4 className="card-title mb-0">
                                                                    Arrow Nav
                                                                    Steps
                                                                </h4>
                                                            </div>
                                                            {/* end card header */}
                                                            <div className="card-body">
                                                                <form
                                                                    action="#"
                                                                    className="form-steps"
                                                                    autoComplete="off"
                                                                >
                                                                    <div className="text-center pt-3 pb-4 mb-1 d-flex justify-content-center">
                                                                        <img
                                                                            src="assets/images/logo-dark.png"
                                                                            className="card-logo card-logo-dark"
                                                                            alt="logo dark"
                                                                            height={
                                                                                17
                                                                            }
                                                                        />
                                                                        <img
                                                                            src="assets/images/logo-blanc.png"
                                                                            className="card-logo card-logo-light"
                                                                            alt="logo light"
                                                                            height={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="step-arrow-nav mb-4">
                                                                        <ul
                                                                            className="nav nav-pills custom-nav nav-justified"
                                                                            role="tablist"
                                                                        >
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link done"
                                                                                    id="steparrow-gen-info-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#steparrow-gen-info"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="steparrow-gen-info"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        0
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    General
                                                                                </button>
                                                                            </li>
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link active"
                                                                                    id="steparrow-description-info-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#steparrow-description-info"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="steparrow-description-info"
                                                                                    aria-selected="true"
                                                                                    data-position={
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    Description
                                                                                </button>
                                                                            </li>
                                                                            <li
                                                                                className="nav-item"
                                                                                role="presentation"
                                                                            >
                                                                                <button
                                                                                    className="nav-link"
                                                                                    id="pills-experience-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#pills-experience"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="pills-experience"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        2
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    Finish
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="tab-content">
                                                                        <div
                                                                            className="tab-pane fade"
                                                                            id="steparrow-gen-info"
                                                                            role="tabpanel"
                                                                            aria-labelledby="steparrow-gen-info-tab"
                                                                        >
                                                                            <div>
                                                                                <div className="row">
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="steparrow-gen-info-email-input"
                                                                                            >
                                                                                                Email
                                                                                            </label>
                                                                                            <input
                                                                                                type="email"
                                                                                                className="form-control"
                                                                                                id="steparrow-gen-info-email-input"
                                                                                                placeholder="Enter email"
                                                                                                required=""
                                                                                            />
                                                                                            <div className="invalid-feedback">
                                                                                                Please
                                                                                                enter
                                                                                                an
                                                                                                email
                                                                                                address
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label"
                                                                                                htmlFor="steparrow-gen-info-username-input"
                                                                                            >
                                                                                                User
                                                                                                Name
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                id="steparrow-gen-info-username-input"
                                                                                                placeholder="Enter user name"
                                                                                                required=""
                                                                                            />
                                                                                            <div className="invalid-feedback">
                                                                                                Please
                                                                                                enter
                                                                                                a
                                                                                                user
                                                                                                name
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        className="form-label"
                                                                                        htmlFor="steparrow-gen-info-password-input"
                                                                                    >
                                                                                        Password
                                                                                    </label>
                                                                                    <input
                                                                                        type="password"
                                                                                        className="form-control"
                                                                                        id="steparrow-gen-info-password-input"
                                                                                        placeholder="Enter password"
                                                                                        required=""
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        Please
                                                                                        enter
                                                                                        a
                                                                                        password
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <label
                                                                                        className="form-label"
                                                                                        htmlFor="steparrow-gen-info-confirm-password-input"
                                                                                    >
                                                                                        Confirm
                                                                                        Password
                                                                                    </label>
                                                                                    <input
                                                                                        type="password"
                                                                                        className="form-control"
                                                                                        id="steparrow-gen-info-confirm-password-input"
                                                                                        placeholder="Enter confirm password"
                                                                                        required=""
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        Please
                                                                                        enter
                                                                                        a
                                                                                        confirm
                                                                                        password
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                    data-nexttab="steparrow-description-info-tab"
                                                                                >
                                                                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                    Go
                                                                                    to
                                                                                    more
                                                                                    info
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                        <div
                                                                            className="tab-pane fade show active"
                                                                            id="steparrow-description-info"
                                                                            role="tabpanel"
                                                                            aria-labelledby="steparrow-description-info-tab"
                                                                        >
                                                                            <div>
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="formFile"
                                                                                        className="form-label"
                                                                                    >
                                                                                        Upload
                                                                                        Image
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        type="file"
                                                                                        id="formFile"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label
                                                                                        className="form-label"
                                                                                        htmlFor="des-info-description-input"
                                                                                    >
                                                                                        Description
                                                                                    </label>
                                                                                    <textarea
                                                                                        className="form-control"
                                                                                        placeholder="Enter Description"
                                                                                        id="des-info-description-input"
                                                                                        rows={
                                                                                            3
                                                                                        }
                                                                                        required=""
                                                                                        defaultValue={
                                                                                            ""
                                                                                        }
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        Please
                                                                                        enter
                                                                                        a
                                                                                        description
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-light btn-label previestab"
                                                                                    data-previous="steparrow-gen-info-tab"
                                                                                >
                                                                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                                                                    Back
                                                                                    to
                                                                                    General
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                    data-nexttab="pills-experience-tab"
                                                                                >
                                                                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                    Submit
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                        <div
                                                                            className="tab-pane fade"
                                                                            id="pills-experience"
                                                                            role="tabpanel"
                                                                            aria-labelledby="pills-experience-tab"
                                                                        >
                                                                            <div className="text-center">
                                                                                <div className="avatar-md mt-5 mb-4 mx-auto">
                                                                                    <div className="avatar-title bg-light text-success display-4 rounded-circle">
                                                                                        <i className="ri-checkbox-circle-fill" />
                                                                                    </div>
                                                                                </div>
                                                                                <h5>
                                                                                    Well
                                                                                    Done
                                                                                    !
                                                                                </h5>
                                                                                <p className="text-muted">
                                                                                    You
                                                                                    have
                                                                                    Successfully
                                                                                    Signed
                                                                                    Up
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* end tab pane */}
                                                                    </div>
                                                                    {/* end tab content */}
                                                                </form>
                                                            </div>
                                                            {/* end card body */}
                                                        </div>
                                                        {/* end card */}
                                                    </div>
                                                    {/* end col */}
                                                </div>
                                                {/* end row */}
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4 className="card-title mb-0">
                                                                    Vertical nav
                                                                    Steps
                                                                </h4>
                                                            </div>
                                                            {/* end card header */}
                                                            <div className="card-body form-steps">
                                                                <form className="vertical-navs-step">
                                                                    <div className="row gy-5">
                                                                        <div className="col-lg-3">
                                                                            <div
                                                                                className="nav flex-column custom-nav nav-pills"
                                                                                role="tablist"
                                                                                aria-orientation="vertical"
                                                                            >
                                                                                <button
                                                                                    className="nav-link done"
                                                                                    id="v-pills-bill-info-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#v-pills-bill-info"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="v-pills-bill-info"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        0
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    <span className="step-title me-2">
                                                                                        <i className="ri-close-circle-fill step-icon me-2" />{" "}
                                                                                        Step
                                                                                        1
                                                                                    </span>
                                                                                    Billing
                                                                                    Info
                                                                                </button>
                                                                                <button
                                                                                    className="nav-link active"
                                                                                    id="v-pills-bill-address-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#v-pills-bill-address"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="v-pills-bill-address"
                                                                                    aria-selected="true"
                                                                                    data-position={
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    <span className="step-title me-2">
                                                                                        <i className="ri-close-circle-fill step-icon me-2" />{" "}
                                                                                        Step
                                                                                        2
                                                                                    </span>
                                                                                    Address
                                                                                </button>
                                                                                <button
                                                                                    className="nav-link"
                                                                                    id="v-pills-payment-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#v-pills-payment"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="v-pills-payment"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        2
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    <span className="step-title me-2">
                                                                                        <i className="ri-close-circle-fill step-icon me-2" />{" "}
                                                                                        Step
                                                                                        3
                                                                                    </span>
                                                                                    Payment
                                                                                </button>
                                                                                <button
                                                                                    className="nav-link"
                                                                                    id="v-pills-finish-tab"
                                                                                    data-bs-toggle="pill"
                                                                                    data-bs-target="#v-pills-finish"
                                                                                    type="button"
                                                                                    role="tab"
                                                                                    aria-controls="v-pills-finish"
                                                                                    aria-selected="false"
                                                                                    data-position={
                                                                                        3
                                                                                    }
                                                                                    tabIndex={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    <span className="step-title me-2">
                                                                                        <i className="ri-close-circle-fill step-icon me-2" />{" "}
                                                                                        Step
                                                                                        4
                                                                                    </span>
                                                                                    Finish
                                                                                </button>
                                                                            </div>
                                                                            {/* end nav */}
                                                                        </div>{" "}
                                                                        {/* end col*/}
                                                                        <div className="col-lg-6">
                                                                            <div className="px-lg-4">
                                                                                <div className="tab-content">
                                                                                    <div
                                                                                        className="tab-pane fade"
                                                                                        id="v-pills-bill-info"
                                                                                        role="tabpanel"
                                                                                        aria-labelledby="v-pills-bill-info-tab"
                                                                                    >
                                                                                        <div>
                                                                                            <h5>
                                                                                                Billing
                                                                                                Info
                                                                                            </h5>
                                                                                            <p className="text-muted">
                                                                                                Fill
                                                                                                all
                                                                                                information
                                                                                                below
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="row g-3">
                                                                                                <div className="col-sm-6">
                                                                                                    <label
                                                                                                        htmlFor="firstName"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        First
                                                                                                        name
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="firstName"
                                                                                                        placeholder="Enter first name"
                                                                                                        defaultValue=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Please
                                                                                                        enter
                                                                                                        a
                                                                                                        first
                                                                                                        name
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                    <label
                                                                                                        htmlFor="lastName"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Last
                                                                                                        name
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="lastName"
                                                                                                        placeholder="Enter last name"
                                                                                                        defaultValue=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Please
                                                                                                        enter
                                                                                                        a
                                                                                                        last
                                                                                                        name
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <label
                                                                                                        htmlFor="username"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Username
                                                                                                    </label>
                                                                                                    <div className="input-group">
                                                                                                        <span className="input-group-text">
                                                                                                            @
                                                                                                        </span>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="form-control"
                                                                                                            id="username"
                                                                                                            placeholder="Username"
                                                                                                            required=""
                                                                                                        />
                                                                                                        <div className="invalid-feedback">
                                                                                                            Please
                                                                                                            enter
                                                                                                            a
                                                                                                            user
                                                                                                            name
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <label
                                                                                                        htmlFor="email"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Email{" "}
                                                                                                        <span className="text-muted">
                                                                                                            (Optional)
                                                                                                        </span>
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="email"
                                                                                                        className="form-control"
                                                                                                        id="email"
                                                                                                        placeholder="Enter Email"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-start gap-3 mt-4">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                                data-nexttab="v-pills-bill-address-tab"
                                                                                            >
                                                                                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                                Go
                                                                                                to
                                                                                                Shipping
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* end tab pane */}
                                                                                    <div
                                                                                        className="tab-pane fade show active"
                                                                                        id="v-pills-bill-address"
                                                                                        role="tabpanel"
                                                                                        aria-labelledby="v-pills-bill-address-tab"
                                                                                    >
                                                                                        <div>
                                                                                            <h5>
                                                                                                Shipping
                                                                                                Address
                                                                                            </h5>
                                                                                            <p className="text-muted">
                                                                                                Fill
                                                                                                all
                                                                                                information
                                                                                                below
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="row g-3">
                                                                                                <div className="col-12">
                                                                                                    <label
                                                                                                        htmlFor="address"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Address
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="address"
                                                                                                        placeholder="1234 Main St"
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Please
                                                                                                        enter
                                                                                                        a
                                                                                                        address
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <label
                                                                                                        htmlFor="address2"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Address
                                                                                                        2{" "}
                                                                                                        <span className="text-muted">
                                                                                                            (Optional)
                                                                                                        </span>
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="address2"
                                                                                                        placeholder="Apartment or suite"
                                                                                                    />
                                                                                                </div>
                                                                                                <div className="col-md-5">
                                                                                                    <label
                                                                                                        htmlFor="country"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Country
                                                                                                    </label>
                                                                                                    <select
                                                                                                        className="form-select"
                                                                                                        id="country"
                                                                                                        required=""
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Choose...
                                                                                                        </option>
                                                                                                        <option>
                                                                                                            United
                                                                                                            States
                                                                                                        </option>
                                                                                                    </select>
                                                                                                    <div className="invalid-feedback">
                                                                                                        Please
                                                                                                        select
                                                                                                        a
                                                                                                        country
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-4">
                                                                                                    <label
                                                                                                        htmlFor="state"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        State
                                                                                                    </label>
                                                                                                    <select
                                                                                                        className="form-select"
                                                                                                        id="state"
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Choose...
                                                                                                        </option>
                                                                                                        <option>
                                                                                                            California
                                                                                                        </option>
                                                                                                    </select>
                                                                                                    <div className="invalid-feedback">
                                                                                                        Please
                                                                                                        select
                                                                                                        a
                                                                                                        state
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-3">
                                                                                                    <label
                                                                                                        htmlFor="zip"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Zip
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="zip"
                                                                                                        placeholder=""
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <hr className="my-4 text-muted" />
                                                                                            <div className="form-check mb-2">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-check-input"
                                                                                                    id="same-address"
                                                                                                />
                                                                                                <label
                                                                                                    className="form-check-label"
                                                                                                    htmlFor="same-address"
                                                                                                >
                                                                                                    Shipping
                                                                                                    address
                                                                                                    is
                                                                                                    the
                                                                                                    same
                                                                                                    as
                                                                                                    my
                                                                                                    billing
                                                                                                    address
                                                                                                </label>
                                                                                            </div>
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-check-input"
                                                                                                    id="save-info"
                                                                                                />
                                                                                                <label
                                                                                                    className="form-check-label"
                                                                                                    htmlFor="save-info"
                                                                                                >
                                                                                                    Save
                                                                                                    this
                                                                                                    information
                                                                                                    for
                                                                                                    next
                                                                                                    time
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-start gap-3 mt-4">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-light btn-label previestab"
                                                                                                data-previous="v-pills-bill-info-tab"
                                                                                            >
                                                                                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                                                                                Back
                                                                                                to
                                                                                                Billing
                                                                                                Info
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                                data-nexttab="v-pills-payment-tab"
                                                                                            >
                                                                                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                                                Go
                                                                                                to
                                                                                                Payment
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* end tab pane */}
                                                                                    <div
                                                                                        className="tab-pane fade"
                                                                                        id="v-pills-payment"
                                                                                        role="tabpanel"
                                                                                        aria-labelledby="v-pills-payment-tab"
                                                                                    >
                                                                                        <div>
                                                                                            <h5>
                                                                                                Payment
                                                                                            </h5>
                                                                                            <p className="text-muted">
                                                                                                Fill
                                                                                                all
                                                                                                information
                                                                                                below
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="my-3">
                                                                                                <div className="form-check form-check-inline">
                                                                                                    <input
                                                                                                        id="credit"
                                                                                                        name="paymentMethod"
                                                                                                        type="radio"
                                                                                                        className="form-check-input"
                                                                                                        defaultChecked=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        htmlFor="credit"
                                                                                                    >
                                                                                                        Credit
                                                                                                        card
                                                                                                    </label>
                                                                                                </div>
                                                                                                <div className="form-check form-check-inline">
                                                                                                    <input
                                                                                                        id="debit"
                                                                                                        name="paymentMethod"
                                                                                                        type="radio"
                                                                                                        className="form-check-input"
                                                                                                        required=""
                                                                                                    />
                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        htmlFor="debit"
                                                                                                    >
                                                                                                        Debit
                                                                                                        card
                                                                                                    </label>
                                                                                                </div>
                                                                                                <div className="form-check form-check-inline">
                                                                                                    <input
                                                                                                        id="paypal"
                                                                                                        name="paymentMethod"
                                                                                                        type="radio"
                                                                                                        className="form-check-input"
                                                                                                        required=""
                                                                                                    />
                                                                                                    <label
                                                                                                        className="form-check-label"
                                                                                                        htmlFor="paypal"
                                                                                                    >
                                                                                                        PayPal
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="row gy-3">
                                                                                                <div className="col-md-12">
                                                                                                    <label
                                                                                                        htmlFor="cc-name"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Name
                                                                                                        on
                                                                                                        card
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="cc-name"
                                                                                                        placeholder=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <small className="text-muted">
                                                                                                        Full
                                                                                                        name
                                                                                                        as
                                                                                                        displayed
                                                                                                        on
                                                                                                        card
                                                                                                    </small>
                                                                                                    <div className="invalid-feedback">
                                                                                                        Name
                                                                                                        on
                                                                                                        card
                                                                                                        is
                                                                                                        required
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    <label
                                                                                                        htmlFor="cc-number"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Credit
                                                                                                        card
                                                                                                        number
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="cc-number"
                                                                                                        placeholder=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Credit
                                                                                                        card
                                                                                                        number
                                                                                                        is
                                                                                                        required
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-3">
                                                                                                    <label
                                                                                                        htmlFor="cc-expiration"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        Expiration
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="cc-expiration"
                                                                                                        placeholder=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Expiration
                                                                                                        date
                                                                                                        required
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-3">
                                                                                                    <label
                                                                                                        htmlFor="cc-cvv"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        CVV
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control"
                                                                                                        id="cc-cvv"
                                                                                                        placeholder=""
                                                                                                        required=""
                                                                                                    />
                                                                                                    <div className="invalid-feedback">
                                                                                                        Security
                                                                                                        code
                                                                                                        required
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-start gap-3 mt-4">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-light btn-label previestab"
                                                                                                data-previous="v-pills-bill-address-tab"
                                                                                            >
                                                                                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                                                                                Back
                                                                                                to
                                                                                                Shipping
                                                                                                Info
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                                data-nexttab="v-pills-finish-tab"
                                                                                            >
                                                                                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />{" "}
                                                                                                Order
                                                                                                Complete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* end tab pane */}
                                                                                    <div
                                                                                        className="tab-pane fade"
                                                                                        id="v-pills-finish"
                                                                                        role="tabpanel"
                                                                                        aria-labelledby="v-pills-finish-tab"
                                                                                    >
                                                                                        <div className="text-center pt-4 pb-2">
                                                                                            <div className="mb-4">
                                                                                                <lord-icon
                                                                                                    src="../../../../cdn.lordicon.com/lupuorrc.json"
                                                                                                    trigger="loop"
                                                                                                    colors="primary:#25a0e2,secondary:#00bd9d"
                                                                                                    style={{
                                                                                                        width: 120,
                                                                                                        height: 120,
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <h5>
                                                                                                Your
                                                                                                Order
                                                                                                is
                                                                                                Completed
                                                                                                !
                                                                                            </h5>
                                                                                            <p className="text-muted">
                                                                                                You
                                                                                                Will
                                                                                                receive
                                                                                                an
                                                                                                order
                                                                                                confirmation
                                                                                                email
                                                                                                with
                                                                                                details
                                                                                                of
                                                                                                your
                                                                                                order.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* end tab pane */}
                                                                                </div>
                                                                                {/* end tab content */}
                                                                            </div>
                                                                        </div>
                                                                        {/* end col */}
                                                                        <div className="col-lg-3">
                                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                                <h5 className="fs-14 text-primary mb-0">
                                                                                    <i className="ri-shopping-cart-fill align-middle me-2" />{" "}
                                                                                    Your
                                                                                    cart
                                                                                </h5>
                                                                                <span className="badge bg-primary rounded-pill">
                                                                                    3
                                                                                </span>
                                                                            </div>
                                                                            <ul className="list-group mb-3">
                                                                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                                                                    <div>
                                                                                        <h6 className="my-0">
                                                                                            Product
                                                                                            name
                                                                                        </h6>
                                                                                        <small className="text-muted">
                                                                                            Brief
                                                                                            description
                                                                                        </small>
                                                                                    </div>
                                                                                    <span className="text-muted">
                                                                                        $12
                                                                                    </span>
                                                                                </li>
                                                                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                                                                    <div>
                                                                                        <h6 className="my-0">
                                                                                            Second
                                                                                            product
                                                                                        </h6>
                                                                                        <small className="text-muted">
                                                                                            Brief
                                                                                            description
                                                                                        </small>
                                                                                    </div>
                                                                                    <span className="text-muted">
                                                                                        $8
                                                                                    </span>
                                                                                </li>
                                                                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                                                                    <div>
                                                                                        <h6 className="my-0">
                                                                                            Third
                                                                                            item
                                                                                        </h6>
                                                                                        <small className="text-muted">
                                                                                            Brief
                                                                                            description
                                                                                        </small>
                                                                                    </div>
                                                                                    <span className="text-muted">
                                                                                        $5
                                                                                    </span>
                                                                                </li>
                                                                                <li className="list-group-item d-flex justify-content-between bg-light">
                                                                                    <div className="text-success">
                                                                                        <h6 className="my-0">
                                                                                            Discount
                                                                                            code
                                                                                        </h6>
                                                                                        <small>
                                                                                            −$5
                                                                                            Discount
                                                                                        </small>
                                                                                    </div>
                                                                                    <span className="text-success">
                                                                                        −$5
                                                                                    </span>
                                                                                </li>
                                                                                <li className="list-group-item d-flex justify-content-between">
                                                                                    <span>
                                                                                        Total
                                                                                        (USD)
                                                                                    </span>
                                                                                    <strong>
                                                                                        $20
                                                                                    </strong>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    {/* end row */}
                                                                </form>
                                                            </div>
                                                        </div>
                                                        {/* end */}
                                                    </div>
                                                    {/* end col */}
                                                </div>
                                                {/* end row */}
                                            </div>
                                            {/* container-fluid */}
                                        </div>
                                        {/* End Page-content */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* End of Page Content */}
                    </main>
                    {/* End of Main */}
                    {/* Start of Footer */}
                    <MobileMenu />
                    {/* End of Footer */}
                </div>
                {/* End of Page Wrapper */}
                {/* Start of Sticky Footer */}
                {/* Start of Scroll Top */}
                <a
                    id="scroll-top"
                    className="scroll-top"
                    href="#top"
                    title="Top"
                    role="button"
                >
                    {" "}
                    <i className="w-icon-angle-up" />{" "}
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 70 70"
                    >
                        {" "}
                        <circle
                            id="progress-indicator"
                            fill="transparent"
                            stroke="#000000"
                            strokeMiterlimit={10}
                            cx={35}
                            cy={35}
                            r={34}
                            style={{ strokeDasharray: "16.4198, 400" }}
                        />{" "}
                    </svg>{" "}
                </a>
                {/* Root element of PhotoSwipe. Must have class pswp */}
                <PhotoSwipe />
            </>
            {/* <LoadExternalStyles /> */}
        </>
    );
};

export default Form;
