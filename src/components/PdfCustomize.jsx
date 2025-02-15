import React, { useEffect, useRef } from "react";
import useImage from "use-image";
import { Image, Transformer } from "react-konva";

export default function PdfCustomize({
  imageUrl,
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  handleDragMove,
  handleDragEnd,
}) {
  const [image] = useImage(imageUrl);

  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={image}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        // onDragEnd={(e) => {
        //   onChange({
        //     ...shapeProps,
        //     x: e.target.x(),
        //     y: e.target.y(),
        //   });
        // }}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scaling to 1 and apply new width & height
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
