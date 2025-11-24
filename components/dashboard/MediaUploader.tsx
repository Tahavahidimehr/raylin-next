import { useRef, useState } from "react";
import { Image, Video, Loader2, Trash2, Star } from "lucide-react";
import { Media } from "@/types/types";

interface MediaUploaderProps {
    folder: string;
    allowImages?: boolean;
    allowVideos?: boolean;
    maxImages?: number;
    maxVideos?: number;
    media?: Media[];
    onChange: (media: Media[]) => void;
    onSetMain?: (path: string) => void;
}

export default function MediaUploader({
                                          folder,
                                          allowImages = true,
                                          allowVideos = false,
                                          maxImages = 1,
                                          maxVideos = 1,
                                          media,
                                          onChange,
                                      }: MediaUploaderProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const getCsrfToken = () => {
        const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
        return match ? decodeURIComponent(match[2]) : "";
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "image" | "video"
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        const uploaded: Media[] = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("file", files[i]);
            formData.append("type", type);
            formData.append("folder", folder);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medias`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                    headers: {
                        "X-XSRF-TOKEN": getCsrfToken(),
                    },
                });

                const json = await res.json();

                if (!res.ok) {
                    console.error(json);
                    continue;
                }

                uploaded.push({
                    ...json.data,
                    type: type as "image" | "video",
                    is_main: false,
                });
            } catch (err) {
                console.error(err);
            }
        }

        onChange([...(media || []), ...uploaded]);

        setUploading(false);
        e.target.value = "";
    };

    const handleDelete = (path: string) => {
        const updated = (media || []).filter((m) => m.path !== path);
        onChange(updated);
    };

    const setMainImage = (path: string) => {
        const updated = (media || []).map((m) => ({ ...m, is_main: m.path === path }));
        onChange(updated);
        if (typeof onChange === "function") onChange(updated);
    };

    const currentMedia = media || [];
    const imageCount = currentMedia.filter((m) => m.type === "image").length;
    const videoCount = currentMedia.filter((m) => m.type === "video").length;

    return (
        <div className="w-full bg-white flex flex-col gap-4 shadow rounded p-5">
            <div className="flex justify-between items-center gap-5">
                {allowImages && (
                    <div
                        onClick={() => imageInputRef.current?.click()}
                        className={`w-1/2 h-36 border border-gray-300 rounded flex flex-col justify-center items-center gap-2 cursor-pointer ${
                            imageCount >= maxImages ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                        {uploading ? (
                            <Loader2 className="size-7 text-prime animate-spin" />
                        ) : (
                            <Image className="size-7 text-prime" />
                        )}
                        <span className="text-gray-600 text-sm">
                            افزودن تصویر ({imageCount}/{maxImages})
                        </span>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            multiple={maxImages > 1}
                            onChange={(e) => handleFileChange(e, "image")}
                            className="hidden"
                        />
                    </div>
                )}

                {allowVideos && (
                    <div
                        onClick={() => videoInputRef.current?.click()}
                        className={`w-1/2 h-36 border border-gray-300 rounded flex flex-col justify-center items-center gap-2 cursor-pointer ${
                            videoCount >= maxVideos ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                        {uploading ? (
                            <Loader2 className="size-7 text-prime animate-spin" />
                        ) : (
                            <Video className="size-7 text-prime" />
                        )}
                        <span className="text-gray-600 text-sm">
                            افزودن ویدیو ({videoCount}/{maxVideos})
                        </span>
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            multiple={maxVideos > 1}
                            onChange={(e) => handleFileChange(e, "video")}
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            {currentMedia.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {currentMedia.map((item) => (
                        <div key={item.path} className="relative border rounded overflow-hidden group">
                            {item.type === "image" ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.path}`}
                                    alt=""
                                    className="w-full h-28 object-cover"
                                />
                            ) : (
                                <video
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.path}`}
                                    className="w-full h-28 object-cover"
                                />
                            )}

                            <button
                                type="button"
                                onClick={() => handleDelete(item.path)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                            >
                                <Trash2 className="size-4 text-red-500" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setMainImage(item.path)}
                                className={`absolute top-1 left-1 bg-white rounded-full p-1 shadow ${
                                    item.is_main ? "text-yellow-500" : "text-gray-400"
                                }`}
                                title="انتخاب به عنوان عکس اصلی"
                            >
                                <Star className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}