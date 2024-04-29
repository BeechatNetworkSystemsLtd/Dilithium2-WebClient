/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import TabLayout from "@components/Layout/TabLayout";
import Field from "~/components/Field";
import Button from "~/components/Button";
import FileInput from "~/components/FileInput";
// @ts-ignore
import { dilithiumGenKeyPair, dilithiumSign } from "@beechatnetwork/lib-dqx";
import { Buffer } from "buffer/index.js";
import { sha256 } from "js-sha256";

const Signing = () => {
    const [keys, setKeys] = useState<{ publicKey: string; secretKey: string }>({
        publicKey: "",
        secretKey: "",
    });
    const [metadata2, setMetadata2] = useState<string>("");
    const [signature, setSignature] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const si_publicKey = localStorage.getItem("si_publicKey");
        const si_secretKey = localStorage.getItem("si_secretKey");
        const si_metadata2 = localStorage.getItem("si_metadata2");
        const si_signature = localStorage.getItem("si_signature");
        if (si_publicKey && si_secretKey)
            setKeys({
                publicKey: si_publicKey,
                secretKey: si_secretKey,
            });
        if (si_metadata2 && si_signature) {
            setMetadata2(si_metadata2);
            setSignature(si_signature);
        }
    }, []);

    const handlePublicKey = (val: string) => {
        setKeys({ ...keys, publicKey: val });
        localStorage.setItem("si_publicKey", val);
    };

    const handleSecretKey = (val: string) => {
        setKeys({ ...keys, secretKey: val });
        localStorage.setItem("si_secretKey", val);
    };

    const handleMetadata2 = (val: string) => {
        try {
            setMetadata2(val);
            localStorage.setItem("si_metadata2", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };

    const generateKeys = async () => {
        const byteArray = new Uint8Array(10);
        const randomBytes = await crypto.getRandomValues(byteArray);
        const data = await dilithiumGenKeyPair({
            randomBytes: () => randomBytes,
        })
            .then((res: object) => {
                setError("");
                return res;
            })
            .catch((err: object) => {
                setError(err.toString());
            });
        localStorage.setItem("si_publicKey", data.publicKey.toString("hex"));
        localStorage.setItem("si_secretKey", data.secretKey.toString("hex"));
        setKeys({
            publicKey: data.publicKey.toString("hex"),
            secretKey: data.secretKey.toString("hex"),
        });
    };

    const sign = async () => {
        const secretKey = Buffer.from(keys.secretKey, "hex");
        const hashedKey = Buffer.from(sha256(JSON.stringify(JSON.parse(metadata2.replace(/'/g, '"')))), "hex");

        const data = await dilithiumSign({
            secretKey,
            challenge: hashedKey,
        })
            .then((res: boolean) => {
                setError("");
                return res;
            })
            .catch((err: object) => {
                setError(err.toString());
            });

        localStorage.setItem("si_metadata2", metadata2);
        localStorage.setItem("si_signature", data.toString("hex"));

        setSignature(data.toString("hex"));
    };

    return (
        <TabLayout>
            <div className="flex flex-col gap-10 mt-10">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row w-full gap-4">
                        <Field
                            label="Public Key"
                            name="public_key"
                            rows={2}
                            placeholder="Public Key"
                            value={keys.publicKey}
                            onChange={handlePublicKey}
                        />
                        <Field
                            label="Secret Key"
                            name="secret_key"
                            rows={2}
                            placeholder="Secret Key"
                            value={keys.secretKey}
                            onChange={handleSecretKey}
                        />
                    </div>
                    <Button label="Generate Keys" onClick={() => generateKeys()} />
                </div>

                <hr className="border-black/30 " />

                <div className="flex flex-col gap-4 pb-8">
                    <Field
                        label="Metadata 2"
                        description="Metadata 2 must be Object"
                        name="metadata2"
                        placeholder="Input metadata to generate Signature"
                        value={metadata2}
                        onChange={setMetadata2}
                        rows={3}
                        actions={<FileInput className="absolute right-0 top-0" handleData={handleMetadata2} />}
                    />
                    {/* <Field
                        label="Challenge"
                        description={`Challenge code will be generated from metadata`}
                        name="challenge"
                        rows={1}
                        placeholder="challenge"
                        value={(() => {
                            try {
                                return metadata2 && sha256(JSON.stringify(JSON.parse(metadata2.replace(/'/g, '"'))) + keys.publicKey);
                            } catch (e) {
                                // handle error and provide a fallback value or action
                                console.error("Error when parsing metadata2: ", e);
                                return "";
                            }
                        })()}
                        readOnly={true}
                    /> */}
                    <Field label="Signature" name="signature" rows={4} placeholder="Signature" value={signature} readOnly={true} />
                    <div className="flex flex-row gap-4">
                        <Button label="Sign" onClick={() => sign()} disabled={metadata2.length === 0} />
                        <Button
                            label="Reset"
                            onClick={async () => {
                                setKeys({
                                    publicKey: "",
                                    secretKey: "",
                                });
                                setError("");
                                handleMetadata2("");
                                setSignature("");
                                localStorage.setItem("si_publicKey", "");
                                localStorage.setItem("si_secretKey", "");
                            }}
                        />
                    </div>
                    {error && <span className="pl-4 border border-l-8 border-gray-500">{error}</span>}
                </div>
            </div>
        </TabLayout>
    );
};

export default Signing;
