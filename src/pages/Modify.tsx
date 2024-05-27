/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import TabLayout from "@components/Layout/TabLayout";
import Field from "~/components/Field";
import Button from "~/components/Button";
import FileInput from "~/components/FileInput";
// @ts-ignore
import { dilithiumVerifySig } from "@beechatnetwork/lib-dqx";
import { Buffer } from "buffer/index.js";
import { sha256 } from "js-sha256";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@utils/axios";

const Verification = () => {
    const [publicKey, setPublicKey] = useState<string>("");
    const [hashedKey, setHashedKey] = useState<string>("");
    const [metadata2, setMetadata2] = useState<string>("");
    const [challenge, setChallenge] = useState<string>("");
    const [signature, setSignature] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [result, setResult] = useState<boolean | null>(null);
    // const [encodingType, setEncodingType] = useState<string>("hex");

    const client = axios(publicKey, signature, challenge);

    useEffect(() => {
        const mo_publicKey = sessionStorage.getItem("mo_publicKey");
        const mo_signature = sessionStorage.getItem("mo_signature");
        const mo_hashKey = sessionStorage.getItem("mo_hashKey");
        const mo_metadata2 = sessionStorage.getItem("mo_metadata2");
        const mo_challenge = sessionStorage.getItem("mo_challenge");
        const mo_result = sessionStorage.getItem("mo_result");
        if (mo_publicKey) setPublicKey(mo_publicKey);
        if (mo_signature) setSignature(mo_signature);
        if (mo_hashKey) setHashedKey(mo_hashKey);
        if (mo_metadata2) setMetadata2(mo_metadata2);
        if (mo_challenge) setChallenge(mo_challenge);
        if (mo_result) setResult(mo_result === "true" ? true : mo_result === "false" ? false : null);
    }, []);

    const handlePublicKey = (val: string) => {
        try {
            setResult(null);
            setPublicKey(val);
            sessionStorage.setItem("mo_publicKey", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleSignature = (val: string) => {
        try {
            setResult(null);
            setSignature(val);
            sessionStorage.setItem("mo_signature", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleHashedKey = (val: string) => {
        try {
            setHashedKey(val);
            sessionStorage.setItem("mo_hashKey", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleChallenge = (val: string) => {
        try {
            setChallenge(val);
            sessionStorage.setItem("mo_challenge", val);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleMetadata2 = (val: string) => {
        try {
            setResult(null);
            setMetadata2(val);
            sessionStorage.setItem("mo_metadata2", val);
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
            sessionStorage.setItem("mo_result", `${res}`);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const handleError = (err: string) => {
        try {
            setError(err);
            sessionStorage.setItem("mo_error", err);
        } catch (err: any) {
            setError(err.toString());
        }
    };
    const resetField = () => {
        handlePublicKey("");
        handleHashedKey("");
        handleMetadata2("");
        handleSignature("");
        handleChallenge("");
        handleError("");
        handleResult(null);
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
        const [hashedkey] = queryKey;
        const resp = await client.get(`/getByHashedKey/${hashedkey}`);

        return resp.data;
    };
    const { data, isRefetching, isLoading, isFetching, refetch } = useQuery({
        queryKey: [hashedKey],
        queryFn: getMetadata,
        enabled: !!hashedKey,
    });
    const updateMetadata = async () => {
        const data = await client.put(`/${hashedKey}`, {
            metadata2: JSON.parse(metadata2.replace(/'/g, '"')),
        });
        return data;
    };

    const { mutate: updateData, isPending: isUpdating } = useMutation({
        mutationFn: updateMetadata,
        onSuccess: () => {
            setResult(null);
            alert("Your data is successfully updated. :)");
            refetch();
        },

        onError: (err) => {
            setError(err.toString());
            alert("Error occured while updating :(");
        },
    });

    const deleteMetadata = async () => {
        const data = await client.delete(`/${hashedKey}`);
        return data;
    };

    const { mutate: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteMetadata,
        onSuccess: () => {
            resetField();
            alert("Your data is successfully removed from database. :)");
            refetch();
        },

        onError: (err) => {
            setError(err.toString());
            alert("Error occured while delete :(");
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
                    <div className="flex flex-col gap-4">
                        <Field
                            label="Hashed Key"
                            description="32bit string"
                            name="hashedKey"
                            placeholder="Input Hashed Key"
                            rows={1}
                            value={hashedKey}
                            onChange={handleHashedKey}
                        />
                        {(isRefetching || isLoading || isFetching) && "Loading data..."}
                        <span className="truncate ...">{data ? JSON.stringify(data?.data) : hashedKey && "Not Exist"}</span>
                    </div>
                    <Field
                        label="Public Key"
                        name="public_key"
                        placeholder="Input public key to verify Signature"
                        rows={2}
                        value={publicKey}
                        onChange={handlePublicKey}
                    />
                    <Field
                        label="Metadata 2"
                        description="Metadata 2 must be Object"
                        name="metadata"
                        placeholder="Input Metadata to verify Signature"
                        rows={4}
                        value={metadata2}
                        onChange={handleMetadata2}
                        actions={<FileInput className="top-0 right-0 md:absolute" handleData={handleMetadata2} />}
                    />
                    <div className="overflow-auto">
                        <span className="text-xl font-normal ">*challenge code: </span>
                        <span className="overflow-auto">{challenge}</span>
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
                        <Button label="Reset" onClick={() => resetField()} />
                        <Button
                            label={isUpdating ? "Updating..." : "Update"}
                            onClick={() => {
                                updateData();
                            }}
                            disabled={!data || hashedKey.length === 0 || result !== true || isUpdating || isRefetching || isLoading || isFetching}
                        />
                        <Button
                            label={isDeleting ? "Deleting..." : "Delete"}
                            onClick={() => {
                                deleteData();
                            }}
                            disabled={!data || hashedKey.length === 0 || isDeleting || isRefetching || isLoading || isFetching}
                        />
                    </div>
                </div>
            </div>
        </TabLayout>
    );
};

export default Verification;
