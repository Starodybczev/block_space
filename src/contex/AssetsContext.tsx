import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Типы
export type AssetsType = {
    id: string;
    name: string;
    url: string;
};

interface AssetsContextType {
    assets: AssetsType[];
    setAssets: React.Dispatch<React.SetStateAction<AssetsType[]>>;
    handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 1. Создаем контекст
const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

// 2. Провайдер (обертка)
export const AssetsProvider = ({ children }: { children: ReactNode }) => {
    const [assets, setAssets] = useState<AssetsType[]>([]);

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            alert("❌ Можно только PNG, JPG, WEBP или SVG");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAssets(prev => [
                ...prev,
                { id: crypto.randomUUID(), name: file.name, url: reader.result as string }
            ]);
        };
        reader.readAsDataURL(file);
    };

    return (
        <AssetsContext.Provider value={{ assets, setAssets, handleUploadFile }}>
            {children}
        </AssetsContext.Provider>
    );
};


export const useAssets = () => {
    const context = useContext(AssetsContext);
    if (!context) throw new Error("useAssets must be used within AssetsProvider");
    return context;
};
