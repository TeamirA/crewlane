import Link from "next/link";

interface AuthSwitchLinkProps {
  prompt: string;
  href: string;
  linkText: string;
}

export function AuthSwitchLink({ prompt, href, linkText }: AuthSwitchLinkProps) {
  return (
    <p className="text-center text-sm text-neutral-600">
      {prompt}{" "}
      <Link href={href} className="font-medium text-indigo-600 hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
