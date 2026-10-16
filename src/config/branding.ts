export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  logoUrl?: string; // Coloque o caminho da sua logo aqui (ex: '/logo.png', '/logo.svg' ou link web)
  whatsapp: {
    number: string; // Ex: '5511999999999'
    formatted: string; // Ex: '(11) 99999-9999'
  };
  pixKey: string;
  pixType: string;
  instagram: string;
  email: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: 'VHDESIGNER3d',
  shortName: 'VH3D',
  tagline: 'O Natal ganha uma nova dimensão.',
  logoUrl: '/logo.svg', // Logo oficial vetorizada VHDESIGNER3d
  whatsapp: {
    number: '5513988437321',
    formatted: '(13) 98843-7321',
  },
  pixKey: 'vhdesigner3d@gmail.com',
  pixType: 'E-mail',
  instagram: '@vhdesigner3d',
  email: 'contato@vhdesigner3d.com.br',
};
