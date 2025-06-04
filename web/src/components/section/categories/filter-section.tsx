type FilterSectionProps = {
    title: string;
    children: React.ReactNode;
  };
  
  export default function FilterSection({ title, children }: FilterSectionProps) {
    return (
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">{title}</h3>
        {children}
      </div>
    );
  }