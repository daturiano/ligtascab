import Image from 'next/image';
import logo from '@/app/public/logo.svg';

export default function LogoWithName() {
  return (
    <div className="flex items-center gap-3 font-extrabold tracking-tighter text-[1.68rem]">
      <Image src={logo} alt="brandlogo ligtascab" height={26} width={26} />
      <p className="font-nunito text-primary hidden lg:block">ligtascab.</p>
      <div className="border-r-1 border-muted-foreground/20 h-8"></div>
    </div>
  );
}
