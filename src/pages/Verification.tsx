/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import TabLayout from "@components/Layout/TabLayout";
import Field from "~/components/Field";
import Button from "~/components/Button";
import FileInput from "~/components/FileInput";
import EncodingTypeSelection from "~/components/EncodingTypeSelection";
// @ts-ignore
import { dilithiumVerifySig } from "@beechatnetwork/lib-dqx";
import { Buffer } from "buffer/index.js";
import { sha256 } from "js-sha256";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@utils/axios";

const Verification = () => {
    const [publicKey, setPublicKey] = useState<string>("");
    const [metadata1, setMetadata1] = useState<string>("");
    const [metadata2, setMetadata2] = useState<string>("");
    const [challenge, setChallenge] = useState<string>("");
    const [signature, setSignature] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [result, setResult] = useState<boolean | null>(null);
    const [encodingType, setEncodingType] = useState<string>("hex");

    const client = axios(publicKey, signature, challenge);

    useEffect(() => {
        const ve_publicKey = sessionStorage.getItem("ve_publicKey");
        const ve_signature = sessionStorage.getItem("ve_signature");
        const ve_metadata1 = sessionStorage.getItem("ve_metadata1");
        const ve_metadata2 = sessionStorage.getItem("ve_metadata2");
        const ve_challenge = sessionStorage.getItem("ve_challenge");
        const ve_result = sessionStorage.getItem("ve_result");
        if (ve_publicKey) setPublicKey(ve_publicKey);
        if (ve_signature) setSignature(ve_signature);
        if (ve_metadata1) setMetadata1(ve_metadata1);
        if (ve_metadata2) setMetadata2(ve_metadata2);
        if (ve_challenge) setChallenge(ve_challenge);
        if (ve_result) setResult(ve_result === "true" ? true : ve_result === "false" ? false : null);
    }, []);

    const handlePublicKey = (val: string) => {
        try {
            setPublicKey(val);
            sessionStorage.setItem("ve_publicKey", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleSignature = (val: string) => {
        try {
            setSignature(val);
            sessionStorage.setItem("ve_signature", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleMetadata1 = (val: string) => {
        try {
            setMetadata1(val);
            sessionStorage.setItem("ve_metadata1", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleChallenge = (val: string) => {
        try {
            setChallenge(val);
            sessionStorage.setItem("ve_challenge", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleMetadata2 = (val: string) => {
        try {
            setMetadata2(val);
            sessionStorage.setItem("ve_metadata2", val);
            handleChallenge(sha256(JSON.stringify(JSON.parse(val.replace(/'/g, '"')))));
            setError("");
        } catch (err: any) {
            handleError(err.toString());
            handleResult(null);
            handleChallenge("");
        }
    };
    const handleResult = (res: boolean | null) => {
        try {
            setResult(res);
            sessionStorage.setItem("ve_result", `${res}`);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleError = (err: string) => {
        try {
            setError(err);
            sessionStorage.setItem("ve_error", err);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const verifySig = async () => {
        const b_publicKey = Buffer.from(publicKey, "hex");
        const b_challenge = Buffer.from(sha256(JSON.stringify(JSON.parse(metadata2.replace(/'/g, '"')))), "hex");
        const b_signature = Buffer.from(signature, "hex");
        dilithiumVerifySig({
            publicKey: b_publicKey,
            challenge: b_challenge,
            signature: b_signature,
        })
            .then((res: boolean) => {
                handleError("");
                handleResult(res);
                return res;
            })
            .catch((err: object) => {
                handleResult(null);
                handleError(err.toString());
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMetadata = async ({ queryKey }: any) => {
        const [metadata1] = queryKey;
        const hashedkey = sha256(metadata1);
        const resp = await client.get(`/${hashedkey}`);

        return resp.data;
    };
    const { data, isRefetching, isLoading, isFetching, refetch } = useQuery({
        queryKey: [metadata1],
        queryFn: getMetadata,
        enabled: !!metadata1,
    });
    const postMetadata = async () => {
        const data = await client.post("/", {
            metadata1: metadata1,
            metadata2: JSON.parse(metadata2.replace(/'/g, '"')),
        });
        return data;
    };

    const { mutate, isPending } = useMutation({
        mutationFn: postMetadata,
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <TabLayout>
            <div className="flex flex-col gap-10 pb-8 mt-10">
                {error && <span className="pl-4 border border-l-8 border-gray-500">{error}</span>}

                {result !== null && (
                    <div className="relative w-full py-4">
                        <span className={`pl-4 py-2 border border-l-8 w-full absolute ${result ? "border-green-500" : "border-gray-500"}`}>
                            {result ? "Successfully verified your signature" : "Failed to verify your signature"}
                        </span>
                        <span
                            className="absolute px-2 rounded-full cursor-pointer right-3 top-6 bg-gray-400/30 hover:bg-gray-400/40"
                            onClick={() => setResult(null)}
                        >
                            X
                        </span>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Field
                        label="Public Key"
                        name="public_key"
                        placeholder="Input public key to verify Signature"
                        rows={2}
                        value={publicKey}
                        onChange={handlePublicKey}
                    />
                    <Field
                        label="Metadata 1"
                        description="Metadata 1 would be String"
                        name="metadata1"
                        rows={4}
                        placeholder="Input Metadata 1 to generate hashed key"
                        value={metadata1}
                        onChange={handleMetadata1}
                        actions={
                            <EncodingTypeSelection
                                className="absolute top-0 right-0"
                                handleData={(event) => {
                                    setEncodingType(event.currentTarget.value);
                                }}
                            />
                        }
                    />
                    <Field
                        label="Metadata 2"
                        description="Metadata 2 must be Object"
                        name="metadata"
                        placeholder="Input Metadata to verify Signature"
                        rows={4}
                        value={metadata2}
                        onChange={handleMetadata2}
                        actions={<FileInput className="absolute top-0 right-0" handleData={handleMetadata2} />}
                    />
                    *challenge code is: {challenge}
                    <div className="flex flex-col gap-4">
                        <Field
                            label="Hashed Key"
                            description="32bit string"
                            name="hashedKey"
                            placeholder="Hashed Key will be generated from Metadata 1"
                            rows={1}
                            readOnly={true}
                            value={metadata1 && sha256(Buffer.from(metadata1, encodingType))}
                        />
                        {(isRefetching || isLoading || isFetching) && "Checking on duplication..."}
                        <span className="truncate ...">{JSON.stringify(data?.data)}</span>
                    </div>
                    <Field
                        label="Signature"
                        name="signature"
                        placeholder="Input Signature to verify"
                        rows={2}
                        value={signature}
                        onChange={handleSignature}
                    />
                    <div className="flex flex-row gap-4">
                        <Button
                            label="Verify"
                            onClick={() => {
                                verifySig();
                            }}
                        />
                        <Button
                            label="Reset"
                            onClick={() => {
                                handlePublicKey("");
                                handleMetadata1("");
                                handleMetadata2("");
                                handleSignature("");
                                handleChallenge("");
                                handleError("");
                                handleResult(null);
                            }}
                        />
                        <Button
                            label={isPending ? "Saving..." : "Post"}
                            onClick={() => {
                                mutate();
                            }}
                            disabled={metadata1.length === 0 || result !== true || isPending || data?.data || isRefetching || isLoading || isFetching}
                        />
                    </div>
                </div>
            </div>
        </TabLayout>
    );
};

export default Verification;
