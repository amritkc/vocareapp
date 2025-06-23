"use client";

import dynamic from "next/dynamic";

const FilterDialog = dynamic(
  () => import("./FilterDialog"),
  { ssr: false }
);

export interface FilterOptions {
  category?: string;
  patient?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ClientFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export default function ClientFilterDialog(props: ClientFilterDialogProps) {
  return <FilterDialog {...props} />;
}