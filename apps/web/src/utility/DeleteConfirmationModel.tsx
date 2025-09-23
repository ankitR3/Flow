"use client";

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import DeleteConfirmationCard from "./DeleteConfirmationCard";

interface DeleteConfirmationModalProps {
    openDeleteModal: boolean;
    setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
    openDeleteModal,
    setOpenDeleteModal,
    onConfirm,
}: DeleteConfirmationModalProps) {
    if (!openDeleteModal) return null;

    return (
        <BlurBG onBackgroundClick={() => setOpenDeleteModal(false)}>
            <DeleteConfirmationCard
                onCancel={() => setOpenDeleteModal(false)}
                onConfirm={onConfirm}
            />
        </BlurBG>
    );
}