import { CircleX } from "lucide-react";
import { memo, useEffect, useState } from "react";


interface FileInputProps {
    fileUrls: string[],
    fileList: FileList | undefined,
    contentTypes: string[],
    clearFiles: () => void
}

export function TextFilePreview({ fileList }: { fileList: FileList | undefined }) {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (!fileList || fileList.length === 0) {
            setContent("");
            return;
        }
        const file = fileList[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            setContent(typeof text === "string" ? text.slice(0, 100) : "");
        };
        reader.readAsText(file);
    }, [fileList]);

    return (
        <div className="text-[5px] leading-1 w-15 h-14 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400">
            <p className="">
                {content}
                {content.length >= 100 && "..."}
            </p>
        </div>
    );
}


function PreviewFile({ fileUrls, clearFiles, fileList, contentTypes }: FileInputProps) {
    return (
        <>
            {fileUrls?.length > 0 &&
                <div className="relative overflow-hidden rounded-md mb-2">
                    <CircleX
                        onClick={() => clearFiles()}
                        className={`absolute top-2  ${contentTypes[0] === "image/jpeg" ? 'w-5 h-5 left-14' : 'w-4 h-4 left-10'} hover:stroke-red-400`}
                    />
                    {contentTypes[0] === "image/jpeg" ?
                        <img src={fileUrls[0]} className='w-20 h-20 rounded-md' alt="attached_image" />
                        :
                    contentTypes[0] === "text/plain" ?
                        <TextFilePreview fileList={fileList} />
                     :
                     <iframe src={fileUrls[0]} className="w-20 h-20 overflow-hidden" scrolling="no"></iframe>   
                    }

                </div>
            }
        </>
    );
}



const FilePreview = memo(PreviewFile, (prevProps, nextProps) => {
    if (prevProps.fileUrls !== nextProps.fileUrls) return false;
    return true;
});


export default FilePreview;