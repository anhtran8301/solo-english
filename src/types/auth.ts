import type { BaseEntity } from "./api";

export type User = Pick<BaseEntity, "id" | "createdAt" | "updatedAt"> & {
	name: string;
	email: string;
	isActive: boolean;
};
