import {
  ChevronLeftIcon,
  HamburgerMenuIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPropfile, ProfileProps } from "../api/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { throttle } from "../lib/utils";

export default function MatchingBoard() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileProps[]>([]);
  const [page, setPage] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<
    (ProfileProps & { checkInsta: boolean }) | null
  >(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const requestData = await getAllPropfile({
        startPage: page,
        endPage: page + 9,
      });
      setData((prev) => [...prev, ...requestData]);
    } catch (error) {
      console.error(error);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleIntersection = useMemo(
    () =>
      throttle((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 10);
        }
      }, 2000),
    []
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(handleIntersection);
      if (node) observer.current.observe(node);
    },
    [handleIntersection]
  );

  return (
    <div className="flex flex-col">
      <header className="flex flex-row w-full items-center justify-between py-6 px-4 shadow-md">
        <ChevronLeftIcon width={24} height={24} onClick={() => navigate("/")} />
        <div className="text-xl font-semibold">소개팅보드</div>
        <HamburgerMenuIcon width={24} height={24} />
      </header>

      <section>
        {data.map((value, idx) => (
          <Dialog key={idx}>
            <DialogTrigger asChild>
              <div
                ref={idx === data.length - 1 ? lastElementRef : null}
                className="flex flex-col w-full py-3 border border-[#CBD5E1] cursor-pointer"
                onClick={() =>
                  setSelectedProfile({ ...value, checkInsta: false })
                }
              >
                <div className="grid grid-cols-2 px-4 pb-2">
                  <div className="font-semibold text-base">
                    {value.nickname}
                  </div>
                  <div className="font-semibold text-base text-right">
                    {value.mbti.toUpperCase()}
                  </div>
                </div>
                <div className="px-4 font-medium text-sm text-[#64748B]">
                  {value.description}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-6">
              <DialogHeader>
                <DialogTitle className="flex items-end gap-5">
                  <div className="text-xl font-semibold">
                    {selectedProfile?.nickname}
                  </div>
                  <div className=" text-sm font-medium text-blue-500">
                    {selectedProfile?.mbti}
                  </div>
                </DialogTitle>
                <DialogDescription className="flex">
                  {selectedProfile?.description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end items-end">
                {!selectedProfile?.checkInsta ? (
                  <button
                    onClick={() => {
                      setSelectedProfile((prev) =>
                        prev ? { ...prev, checkInsta: true } : prev
                      );
                      console.log(selectedProfile?.insta_profile);
                    }}
                    className="border px-4 py-2 w-fit bg-[#0F172A] text-white rounded-md text-sm"
                  >
                    인스타 확인하기
                  </button>
                ) : (
                  <div className=" text-black flex flex-row items-center gap-3">
                    <InstagramLogoIcon
                      onClick={() => {
                        window.open(
                          `https://www.instagram.com/${selectedProfile.insta_profile}`
                        );
                      }}
                      height={24}
                      width={24}
                    />
                    @{selectedProfile?.insta_profile}
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </section>
    </div>
  );
}
