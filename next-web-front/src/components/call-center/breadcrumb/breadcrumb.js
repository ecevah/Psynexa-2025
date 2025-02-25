"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { setBreadcrumbs } from "@/store/features/breadcrumbSlice";
import Image from "next/image";

const Breadcrumb = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.breadcrumb);

  useEffect(() => {
    // URL'i parçalara ayır ve locale kısmını çıkar
    const pathParts = pathname.split("/").filter(Boolean);
    const pathWithoutLocale = pathParts.slice(1);

    // Breadcrumb items'ları oluştur
    const newItems = pathWithoutLocale.reduce((acc, part, index) => {
      // URL'i kümülatif olarak oluştur
      const url = "/" + pathWithoutLocale.slice(0, index + 1).join("/");

      // Part ismini daha okunabilir hale getir
      const text = part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return [
        ...acc,
        {
          text,
          link: url,
          active: index === pathWithoutLocale.length - 1,
        },
      ];
    }, []);

    // Her zaman Dashboard'ı ekle
    if (pathWithoutLocale[0] !== "dashboard") {
      newItems.unshift({
        text: "Dashboard",
        link: "/dashboard",
        active: false,
      });
    }

    dispatch(setBreadcrumbs(newItems));
  }, [pathname, dispatch]);

  const handleClick = (link, active) => {
    if (!active) {
      router.push(`/${params.locale}${link}`);
    }
  };

  const lastItem = items[items.length - 1];

  return (
    <div className="flex items-center font-urbanist">
      {/* Mobil görünüm (555px altı) - Sadece son öğe */}
      <div className="min-[555px]:hidden flex items-center">
        <span
          onClick={() => handleClick(lastItem?.link, lastItem?.active)}
          className="text-[#0B1215] text-[24px] font-semibold leading-[40px] cursor-pointer"
        >
          {lastItem?.text}
        </span>
      </div>

      {/* Desktop görünüm (555px üstü) - Tüm öğeler */}
      <div className="hidden min-[555px]:flex items-center">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              onClick={() => handleClick(item.link, item.active)}
              className={`cursor-pointer ${
                index === 0
                  ? "text-[#0B1215] text-[24px] font-semibold leading-[40px]"
                  : "text-[#0B1215] text-[18px] font-medium leading-[32px] opacity-50"
              }`}
            >
              {item.text}
            </span>
            {index < items.length - 1 && (
              <div className="mx-2 flex items-center rotate-[-90deg]">
                <Image
                  src={
                    index === 0
                      ? "/call-center/arrow-down.svg"
                      : "/call-center/arrow-down-grey.svg"
                  }
                  alt="separator"
                  width={16}
                  height={10}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
