import React, { useState } from "react";

function FileUploader({
    label,
    name,
    initialFileName,
    initialFileSize,
    initialFileType,
    onChange,
    initialPreview,
    LG_LSTID,
}) {
    const [preview, setPreview] = useState(initialPreview || null);
    const [fileName, setFileName] = useState(initialFileName || null);
    const [fileSize, setFileSize] = useState(initialFileSize || null);
    const [fileType, setFileType] = useState(initialFileType || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFileName(file.name);
            setFileSize(file.size);
            setFileType(file.type);
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //     setPreview(reader.result);
            // };
            // reader.readAsDataURL(file);
            onChange(name, file, LG_LSTID);
        }
    };
    return (
        <div className="form-group">
            <label>{label}</label>

            <div className="parent" style={{ margin: "10px 0px" }}>
                <input
                    type="file"
                    className="form-control form-control-md"
                    name={name}
                    id={name}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <div>
                        <svg
                            width={24}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" />
                        </svg>
                    </div>
                    <div>
                        <small>
                            {fileName
                                ? fileName.slice(0, 10) + "..."
                                : "Aucun fichier selectionné"}
                        </small>
                        {fileName && (
                            <>
                                <div style={{ lineHeight: ".8" }}>
                                    <small style={{ fontSize: ".8em" }}>
                                        {fileType}
                                    </small>{" "}
                                    |{" "}
                                    <small style={{ fontSize: ".8em" }}>
                                        {(fileSize / (1024 * 1024)).toFixed(2)}{" "}
                                        MB
                                    </small>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="box-button" style={{ alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <label
                            htmlFor={name}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                            }}
                        />
                        <button
                            className="label"
                            style={{ marginRight: "6px", cursor: "pointer" }}
                        >
                            <svg
                                width={18}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button type="button">
                            <svg
                                width={18}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {preview && (
                <img
                    src={preview}
                    alt={label}
                    height={100}
                    className="img-preview mb-5"
                />
            )}
        </div>
    );
}

export default FileUploader;
