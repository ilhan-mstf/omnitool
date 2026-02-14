import { ShieldCheck, Code, Link } from 'lucide-react';

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  category: 'Encoders' | 'Formatters' | 'Generators' | 'Converters';
  icon: any;
  defaultOptions: any;
}

export const TOOL_REGISTRY: Record<string, ToolMetadata> = {
  base64: {
    id: 'base64',
    name: 'Base64',
    description: 'Encode or decode strings',
    category: 'Encoders',
    icon: ShieldCheck,
    defaultOptions: { action: 'encode' }
  },
  json_formatter: {
    id: 'json_formatter',
    name: 'JSON Formatter',
    description: 'Prettify or minify JSON',
    category: 'Formatters',
    icon: Code,
    defaultOptions: { indent: 2, minify: false }
  },
  url_encoder: {
    id: 'url_encoder',
    name: 'URL Encoder',
    description: 'Safely escape/unescape URLs',
    category: 'Encoders',
    icon: Link,
    defaultOptions: { action: 'encode' }
  },
  jwt_debugger: {
    id: 'jwt_debugger',
    name: 'JWT Debugger',
    description: 'Decode and inspect JWT segments',
    category: 'Converters',
    icon: ShieldCheck,
    defaultOptions: {}
  }
};

export const getToolById = (id: string) => TOOL_REGISTRY[id];
export const getAllTools = () => Object.values(TOOL_REGISTRY);
