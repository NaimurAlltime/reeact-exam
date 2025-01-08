import { useState, useRef, MouseEvent, ChangeEvent, FormEvent } from 'react';
import './customLogo.css';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export function CustomLogo() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [size, setSize] = useState<Size>({ width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
    if (!logoUrl) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const containerBounds = containerRef.current.getBoundingClientRect();
    const newX = Math.min(
      Math.max(0, e.clientX - dragStart.x),
      containerBounds.width - size.width
    );
    const newY = Math.min(
      Math.max(0, e.clientY - dragStart.y),
      containerBounds.height - size.height
    );
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleResize = (delta: number) => {
    const aspectRatio = size.width / size.height;
    const newWidth = Math.max(50, size.width + delta);
    const newHeight = newWidth / aspectRatio;
    setSize({ width: newWidth, height: newHeight });
  };

  const downloadFinalImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tShirt = new Image();
    const logo = new Image();

    tShirt.src = 'https://acquires.in/cdn/shop/files/smooth-white-cotton-t-shirt-with-beautiful-3d-design-879335.jpg?v=1723878953';
    logo.src = logoUrl;

    tShirt.onload = () => {
      canvas.width = tShirt.width;
      canvas.height = tShirt.height;
      ctx?.drawImage(tShirt, 0, 0);

      const scaleX = tShirt.width / containerRef.current!.offsetWidth;
      const scaleY = tShirt.height / containerRef.current!.offsetHeight;

      ctx?.drawImage(
        logo,
        position.x * scaleX,
        position.y * scaleY,
        size.width * scaleX,
        size.height * scaleY
      );
      const link = document.createElement('a');
      link.download = 'custom-tshirt.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="container2">
      <div
        ref={containerRef}
        className="tshirt-container"
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <img
          src="https://acquires.in/cdn/shop/files/smooth-white-cotton-t-shirt-with-beautiful-3d-design-879335.jpg?v=1723878953"
          alt="T-shirt Template"
          className="tshirt-image"
        />

        {logoUrl && (
          <div
            ref={logoRef}
            className="logo-container"
            style={{
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
            }}
            onMouseDown={handleDragStart}
          >
            <img
              src={logoUrl}
              alt="Logo"
              className="logo-image"
              draggable={false}
            />
            <div
              className="resize-handle"
              onMouseDown={() => handleResize(20)}
            ></div>
          </div>
        )}
      </div>

      <form onSubmit={(e: FormEvent) => e.preventDefault()} className="form-container">
        <div className="input-group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </div>
        <div className="button-container">
          <button type="button" onClick={downloadFinalImage} className="submit-button">
            Download Final Image
          </button>
        </div>
      </form>
    </div>
  );
}
