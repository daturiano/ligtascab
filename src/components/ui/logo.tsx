import Image from 'next/image';
import logo from '@/app/public/logo.svg';

export default function Logo() {
  return (
    <div className="font-extrabold tracking-tighter text-[1.68rem]">
      <Image src={logo} alt="brandlogo ligtascab" height={26} width={26} />
    </div>
  );
}
