/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import TabLayout from "@components/Layout/TabLayout";
import Field from "~/components/Field";
import Button from "~/components/Button";
// @ts-ignore
import { dilithiumVerifySig } from "@beechatnetwork/lib-dqx";
import { Buffer } from "buffer/index.js";
import { sha256 } from "js-sha256";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@utils/axios";

const Verification = () => {
    const [publicKey, setPublicKey] = useState<string>("");
    const [signature, setSignature] = useState<string>("");
    const [nftMetadata, setNftMetadata] = useState<string>("");
    const [hashedKey, setHashedKey] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [result, setResult] = useState<boolean | null>(null);

    const client = axios(publicKey, signature, nftMetadata && sha256(JSON.stringify(JSON.parse(nftMetadata.replace(/'/g, '"')))));

    useEffect(() => {
        const ve_publicKey = sessionStorage.getItem("ve_publicKey");
        const ve_signature = sessionStorage.getItem("ve_signature");
        const ve_nftMetadata = sessionStorage.getItem("ve_nftMetadata");
        const ve_result = sessionStorage.getItem("ve_result");
        if (ve_publicKey) setPublicKey(ve_publicKey);
        if (ve_signature) setSignature(ve_signature);
        if (ve_nftMetadata) setNftMetadata(ve_nftMetadata);
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
    const handleNftMetadata = (val: string) => {
        try {
            setNftMetadata(val);
            sessionStorage.setItem("ve_nftMetadata", val);
        } catch (err: any) {
            setError(err.toString());
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
        const b_challenge = Buffer.from(sha256(JSON.stringify(JSON.parse(nftMetadata.replace(/'/g, '"')))), "hex");
        const b_signature = Buffer.from(signature, "hex");
        dilithiumVerifySig({
            publicKey: b_publicKey,
            challenge: b_challenge,
            signature: b_signature,
        })
            .then((res: boolean) => {
                handleError("");
                handleResult(res);
                if (res) setHashedKey(sha256(signature + JSON.stringify(JSON.parse(nftMetadata.replace(/'/g, '"')))));
                else setHashedKey("");
                return res;
            })
            .catch((err: object) => {
                handleResult(null);
                handleError(err.toString());
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getnftMetadata = async ({ queryKey }: any) => {
        const [hashedKey] = queryKey;
        const resp = await client.get(`/${hashedKey}`);
        return resp.data;
    };
    const { data, isRefetching, isLoading, isFetching, refetch } = useQuery({
        queryKey: [hashedKey],
        queryFn: getnftMetadata,
        enabled: !!hashedKey,
    });
    const postnftMetadata = async () => {
        const data = await client.post("/", {
            metadata: JSON.parse(nftMetadata.replace(/'/g, '"')),
        });
        return data;
    };

    const { mutate, isPending } = useMutation({
        mutationFn: postnftMetadata,
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <TabLayout>
            <div className="flex flex-col gap-10 pb-8 mt-10">
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
                        label="Challenge"
                        description={`Challenge code will be generated from nftMetadata`}
                        name="challenge"
                        rows={1}
                        placeholder="challenge"
                        value={nftMetadata && sha256(JSON.stringify(JSON.parse(nftMetadata.replace(/'/g, '"'))))}
                        readOnly={true}
                    />
                    <Field
                        label="Signature"
                        name="signature"
                        placeholder="Input Signature to verify"
                        rows={2}
                        value={signature}
                        onChange={handleSignature}
                    />
                    <Field
                        label="nftMetadata"
                        description="nftMetadata must be Object"
                        name="nftMetadata"
                        placeholder="Input nftMetadata to verify Signature"
                        rows={8}
                        value={nftMetadata}
                        onChange={handleNftMetadata}
                    />
                    <Button
                        label="Verify"
                        onClick={() => {
                            verifySig();
                        }}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Field
                        label="Hashed Key"
                        name="hashedKey"
                        placeholder="Input hashed key to save nftMetadata"
                        rows={1}
                        value={hashedKey}
                        onChange={setHashedKey}
                    />
                    {(isRefetching || isLoading || isFetching) && "Checking on duplication..."}
                    <span className="truncate ...">{JSON.stringify(data?.data)}</span>
                    <Button
                        label={isPending ? "Saving..." : "Post"}
                        onClick={() => {
                            mutate();
                        }}
                        disabled={hashedKey.length === 0 || result !== true || isPending || data?.data || isRefetching || isLoading || isFetching}
                    />
                </div>

                {error && <span className="pl-4 border border-l-8 border-gray-500">{error}</span>}
            </div>
        </TabLayout>
    );
};

export default Verification;
