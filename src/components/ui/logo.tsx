import Image from 'next/image';
import logo from '@/app/public/logo.svg';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-extrabold tracking-tighter text-[1.68rem]">
      <Image src={logo} alt="brandlogo ligtascab" height={26} width={26} />
      <p className="font-nunito text-primary">ligtascab.</p>
    </div>
  );
}
