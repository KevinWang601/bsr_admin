import React from 'react';
import { useEffect, useState } from 'react';
import { Spin, Image } from 'antd';
import { processEncryptedImage } from '@/utils/decrypt';

interface EncryptedImageProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
  preview?: boolean;
  placeholder?: React.ReactNode;
}

const EncryptedImage: React.FC<EncryptedImageProps> = (props) => {
  const {
    src,
    alt = '加密图片',
    width,
    height,
    className,
    style,
    fallback,
    preview = true,
    placeholder,
  } = props;

  const [decryptedSrc, setDecryptedSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let blobUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setHasError(false);
        if (src == null) return;
        const url = await processEncryptedImage(src);
        blobUrl = url;
        if (isMounted) {
          setDecryptedSrc(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('解密图片失败:', err);
        if (isMounted) {
          setHasError(true);
          setLoading(false);
          if (fallback) {
            setDecryptedSrc(fallback);
          }
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src, fallback]);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
  };

  if (loading) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width,
          height,
          ...style,
        },
        className,
      },
      placeholder || React.createElement(Spin),
    );
  }

  if (hasError && !fallback) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width,
          height,
          background: '#f0f0f0',
          color: '#999',
          ...style,
        },
        className,
      },
      '加载失败',
    );
  }

  return React.createElement(Image, {
    src: decryptedSrc,
    alt,
    width,
    height,
    className,
    style,
    preview,
    draggable: false,
    onContextMenu: handleContextMenu,
    fallback,
  });
};

export default EncryptedImage;
