import Link from "next/link";

interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  className?: string;
  menuItems: MenuItem[];
}

export default function ProfileSidebar({ className, menuItems }: Props) {
  return (
    <aside className={className}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Profile Menu</h2>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              {item.href ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="hover:underline text-left w-full"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}