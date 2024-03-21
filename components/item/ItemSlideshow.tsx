import { FC } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import Image from 'next/image';

interface Props {
    images: string[]
}

export const ItemSlideshow: FC<Props> = ({ images }) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
    {images.map((item) => (
      <ImageListItem key={item}>
        <Image
          //srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          src={`${item}?w=164&h=164&fit=crop&auto=format`}
          alt={item}
          loading="lazy"
        />
      </ImageListItem>
    ))}
  </ImageList>
   
  )
}
