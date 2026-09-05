"use client";

import type React from "react";
import {
	type ChangeEvent,
	type DragEvent,
	type InputHTMLAttributes,
	useCallback,
	useRef,
	useState,
} from "react";
import { fData } from "@/utils/format-number";

export type FileMetadata = {
	name: string;
	size: number;
	type: string;
	url: string;
	id: string;
};

export type FileWithPreview = {
	file: File | FileMetadata;
	id: string;
	preview?: string;
};

export type FileUploadOptions = {
	maxFiles?: number; // Only used when multiple is true, defaults to Infinity
	maxSize?: number; // in bytes
	accept?: string;
	multiple?: boolean; // Defaults to false
	initialFiles?: FileMetadata[];
	disableWaterMark?: boolean;
	onFilesChange?: (files: FileWithPreview[]) => void; // Callback when files change
	onFilesAdded?: (addedFiles: FileWithPreview[]) => void; // Callback when new files are added
};

export type FileUploadState = {
	files: FileWithPreview[];
	isDragging: boolean;
	isLoading: boolean;
	errors: string[];
};

export type FileUploadActions = {
	addFiles: (files: FileList | File[]) => void;
	removeFile: (id: string) => void;
	clearFiles: (shallow?: boolean) => void;
	clearErrors: () => void;
	handleDragEnter: (e: DragEvent<HTMLElement>) => void;
	handleDragLeave: (e: DragEvent<HTMLElement>) => void;
	handleDragOver: (e: DragEvent<HTMLElement>) => void;
	handleDrop: (e: DragEvent<HTMLElement>) => void;
	handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleChangeOrder: (files: FileWithPreview[]) => void;
	openFileDialog: () => void;
	getInputProps: (
		props?: InputHTMLAttributes<HTMLInputElement>,
	) => InputHTMLAttributes<HTMLInputElement> & {
		ref: React.Ref<HTMLInputElement>;
	};
};

export const useFileUpload = (
	options: FileUploadOptions = {},
): [FileUploadState, FileUploadActions] => {
	const {
		maxFiles = Number.POSITIVE_INFINITY,
		maxSize = Number.POSITIVE_INFINITY,
		accept = "*",
		multiple = false,
		initialFiles = [],
		disableWaterMark = false,
		onFilesChange,
		onFilesAdded,
	} = options;

	const [state, setState] = useState<FileUploadState>({
		files: initialFiles.map((file) => {
			if (file instanceof File) {
				return {
					file,
					id: file.id || file.name,
					preview: URL.createObjectURL(file),
				};
			}

			return { file, id: file.id, preview: file.url };
		}),
		isLoading: false,
		isDragging: false,
		errors: [],
	});

	const inputRef = useRef<HTMLInputElement>(null);

	const validateFile = useCallback(
		(file: File | FileMetadata): string | null => {
			if (file instanceof File) {
				if (file.size > maxSize) {
					return `File "${file.name}" exceeds the maximum size of ${fData(maxSize)}.`;
				}
			} else {
				if (file.size > maxSize) {
					return `File "${file.name}" exceeds the maximum size of ${fData(maxSize)}.`;
				}
			}

			if (accept !== "*") {
				const acceptedTypes = accept.split(",").map((type) => type.trim());
				const fileType = file instanceof File ? file.type || "" : file.type;
				const fileExtension = `.${file instanceof File ? file.name.split(".").pop() : file.name.split(".").pop()}`;

				const isAccepted = acceptedTypes.some((type) => {
					if (type.startsWith(".")) {
						return fileExtension.toLowerCase() === type.toLowerCase();
					}
					if (type.endsWith("/*")) {
						const baseType = type.split("/")[0];
						return fileType.startsWith(`${baseType}/`);
					}
					return fileType === type;
				});

				if (!isAccepted) {
					return `File "${file instanceof File ? file.name : file.name}" is not an accepted file type.`;
				}
			}

			return null;
		},
		[accept, maxSize],
	);

	// Helper function to get file extension
	const getFileExtension = useCallback((filename: string): string => {
		return filename.split(".").pop()?.toLowerCase() || "";
	}, []);

	// Helper function to get MIME type and canvas output format based on file extension
	const getFileFormat = useCallback(
		(filename: string): { mimeType: string; canvasFormat: string } => {
			const extension = getFileExtension(filename);

			switch (extension) {
				case "jpg":
				case "jpeg":
					return { mimeType: "image/jpeg", canvasFormat: "image/jpeg" };
				case "png":
					return { mimeType: "image/png", canvasFormat: "image/png" };
				case "webp":
					return { mimeType: "image/webp", canvasFormat: "image/webp" };
				case "gif":
					return { mimeType: "image/gif", canvasFormat: "image/png" }; // GIF animated không thể tạo watermark, dùng PNG
				case "bmp":
					return { mimeType: "image/bmp", canvasFormat: "image/png" }; // BMP không được hỗ trợ canvas.toDataURL
				default:
					return { mimeType: "image/png", canvasFormat: "image/png" };
			}
		},
		[getFileExtension],
	);

	const dataURLtoFile = useCallback((dataURL: string, filename: string, mimeType?: string) => {
		const arr = dataURL.split(",");
		const mime = mimeType || arr[0].match(/:(.*?);/)?.[1];
		const bstr = atob(arr[arr.length - 1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}, []);

	const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
		if (file instanceof File) {
			return URL.createObjectURL(file);
		}
		return file.url;
	}, []);

	const createWatermarkImage = useCallback(
		(file: File): Promise<{ file: File; preview: string }> => {
			return new Promise((resolve, reject) => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				const blobFile = createPreview(file) as string;
				const img = new Image();
				img.src = blobFile;
				img.crossOrigin = "anonymous";

				img.onload = () => {
					if (!ctx) return reject("Canvas context not available");

					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);

					const watermarkImg = new Image();
					watermarkImg.src = "/logo/logo.svg";
					watermarkImg.crossOrigin = "anonymous";

					watermarkImg.onload = () => {
						const maxRatio = 0.3;
						const maxWatermarkWidth = canvas.width * maxRatio;
						const maxWatermarkHeight = canvas.height * maxRatio;

						const watermarkAspect = watermarkImg.width / (watermarkImg.height || 1);

						let newWatermarkWidth = maxWatermarkWidth;
						let newWatermarkHeight = maxWatermarkWidth / watermarkAspect;

						if (newWatermarkHeight > maxWatermarkHeight) {
							newWatermarkHeight = maxWatermarkHeight;
							newWatermarkWidth = maxWatermarkHeight * watermarkAspect;
						}

						const x = canvas.width / 2 - newWatermarkWidth / 2;
						const y = canvas.height / 2 - newWatermarkHeight / 2;

						ctx.globalAlpha = 0.1;
						ctx.drawImage(watermarkImg, x, y, newWatermarkWidth, newWatermarkHeight);

						const { mimeType, canvasFormat } = getFileFormat(file.name);
						const quality = canvasFormat === "image/jpeg" ? 0.9 : undefined;
						const watermarkedImageUrl = canvas.toDataURL(canvasFormat, quality);
						const fileWatermark = dataURLtoFile(watermarkedImageUrl, file.name, mimeType);

						canvas.remove();
						img.remove();
						watermarkImg.remove();
						URL.revokeObjectURL(blobFile);

						resolve({
							file: fileWatermark,
							preview: createPreview(fileWatermark) as string,
						});
					};

					watermarkImg.onerror = (_err) => reject("Failed to load watermark image");
				};

				img.onerror = (_err) => reject("Failed to load image");
			});
		},
		[createPreview, dataURLtoFile, getFileFormat],
	);

	const generateUniqueId = useCallback((file: File | FileMetadata): string => {
		if (file instanceof File) {
			return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		}
		return file.id;
	}, []);

	const clearFiles = useCallback(
		(shallow = false) => {
			setState((prev) => {
				if (!shallow) {
					// Clean up object URLs
					for (const file of prev.files) {
						if (file.preview && file.file instanceof File && file.file.type.startsWith("image/")) {
							URL.revokeObjectURL(file.preview);
						}
					}
				}

				if (inputRef.current) {
					inputRef.current.value = "";
				}

				const newState = {
					...prev,
					files: [],
					errors: [],
				};

				onFilesChange?.(newState.files);
				return newState;
			});
		},
		[onFilesChange],
	);

	const addFiles = useCallback(
		async (newFiles: FileList | File[]) => {
			if (!newFiles || newFiles.length === 0) return;

			const newFilesArray = Array.from(newFiles);
			const errors: string[] = [];

			// Clear existing errors when new files are uploaded
			setState((prev) => ({ ...prev, errors: [], isLoading: true }));

			// In single file mode, clear existing files first
			if (!multiple) {
				clearFiles();
			}

			// Check if adding these files would exceed maxFiles (only in multiple mode)
			if (
				multiple &&
				maxFiles !== Number.POSITIVE_INFINITY &&
				state.files.length + newFilesArray.length > maxFiles
			) {
				errors.push(`You can only upload a maximum of ${maxFiles} files.`);
				setState((prev) => ({ ...prev, errors, isLoading: false }));
				return;
			}

			const validFiles: FileWithPreview[] = [];
			setState((prev) => ({ ...prev, errors: [] }));
			for (const file of newFilesArray) {
				// Only check for duplicates if multiple files are allowed
				if (multiple) {
					const isDuplicate = state.files.some(
						(existingFile) =>
							existingFile.file.name === file.name && existingFile.file.size === file.size,
					);

					// Skip duplicate files silently
					if (isDuplicate) {
						return;
					}
				}

				// Check file size
				if (file.size > maxSize) {
					errors.push(
						multiple
							? `Some files exceed the maximum size of ${fData(maxSize)}.`
							: `File exceeds the maximum size of ${fData(maxSize)}.`,
					);
					return;
				}

				const error = validateFile(file);
				if (error) {
					errors.push(error);
				} else {
					let fileConvert = file;
					let id = generateUniqueId(file);
					let previewUrl = createPreview(file);

					// Chỉ tạo watermark cho file ảnh
					if (!disableWaterMark && file.type.startsWith("image/")) {
						try {
							const { preview, file: fileWatermark } = await createWatermarkImage(file);
							fileConvert = fileWatermark;
							id = generateUniqueId(fileWatermark);
							previewUrl = preview;
						} catch (error) {
							console.error("Error creating watermark:", error);
							// Nếu không tạo được watermark, sử dụng file gốc
						}
					}

					validFiles.push({
						file: fileConvert,
						id: id,
						preview: previewUrl,
					});
				}
			}

			// Only update state if we have valid files to add
			if (validFiles.length > 0) {
				// Call the onFilesAdded callback with the newly added valid files
				onFilesAdded?.(validFiles);

				setState((prev) => {
					const newFiles = !multiple ? validFiles : [...prev.files, ...validFiles];
					onFilesChange?.(newFiles);
					return {
						...prev,
						files: newFiles,
						errors,
					};
				});
			} else if (errors.length > 0) {
				setState((prev) => ({
					...prev,
					errors,
				}));
			}

			// Reset input value after handling files
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			setState((prev) => ({ ...prev, isLoading: false }));
		},
		[
			state.files,
			maxFiles,
			multiple,
			maxSize,
			validateFile,
			createPreview,
			generateUniqueId,
			clearFiles,
			onFilesChange,
			onFilesAdded,
			disableWaterMark,
			createWatermarkImage,
		],
	);

	const removeFile = useCallback(
		(id: string) => {
			setState((prev) => {
				const fileToRemove = prev.files.find((file) => file.id === id);
				if (
					fileToRemove?.preview &&
					fileToRemove.file instanceof File &&
					fileToRemove.file.type.startsWith("image/")
				) {
					URL.revokeObjectURL(fileToRemove.preview);
				}

				const newFiles = prev.files.filter((file) => file.id !== id);
				onFilesChange?.(newFiles);

				return {
					...prev,
					files: newFiles,
					errors: [],
				};
			});
		},
		[onFilesChange],
	);

	const clearErrors = useCallback(() => {
		setState((prev) => ({
			...prev,
			errors: [],
		}));
	}, []);

	const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setState((prev) => ({ ...prev, isDragging: true }));
	}, []);

	const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.currentTarget.contains(e.relatedTarget as Node)) {
			return;
		}

		setState((prev) => ({ ...prev, isDragging: false }));
	}, []);

	const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setState((prev) => ({ ...prev, isDragging: false }));

			// Don't process files if the input is disabled
			if (inputRef.current?.disabled) {
				return;
			}

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				// In single file mode, only use the first file
				if (!multiple) {
					const file = e.dataTransfer.files[0];
					addFiles([file]);
				} else {
					addFiles(e.dataTransfer.files);
				}
			}
		},
		[addFiles, multiple],
	);

	const handleFileChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.files && e.target.files.length > 0) {
				addFiles(e.target.files);
			}
		},
		[addFiles],
	);

	const openFileDialog = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	}, []);

	const getInputProps = useCallback(
		(props: InputHTMLAttributes<HTMLInputElement> = {}) => {
			return {
				...props,
				type: "file" as const,
				onChange: handleFileChange,
				accept: props.accept || accept,
				multiple: props.multiple !== undefined ? props.multiple : multiple,
				ref: inputRef,
			};
		},
		[accept, multiple, handleFileChange],
	);

	const handleChangeOrder = useCallback((files: FileWithPreview[]) => {
		setState((prev) => ({ ...prev, files }));
	}, []);

	return [
		state,
		{
			addFiles,
			removeFile,
			clearFiles,
			clearErrors,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			handleFileChange,
			openFileDialog,
			getInputProps,
			handleChangeOrder,
		},
	];
};
