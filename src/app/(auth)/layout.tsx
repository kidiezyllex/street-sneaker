"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./styles.module.scss";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  return (
    <div className={`mt-4 flex flex-col items-center ${styles.root}`}>
      <div className="py-3">
        <Image src={"/images/amz.svg"} width={178} height={76} alt="" />
      </div>

      <div className={`form  w-[380px]  flex flex-col justify-center`}>
        {children}
      </div>
      {pathName?.startsWith("/sign-in") && (
        <div>
          <p className="text-[#767676] text-center mt-4 text-xs">
            New to Amazon ?
          </p>

          <span className="register_account">
            <Link href={"/sign-up"}>Create your Amazon account</Link>
          </span>
        </div>
      )}
    </div>
  );
}

export default AuthLayout;
