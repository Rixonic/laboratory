import { FC } from 'react';
import { ImageList, ImageListItem } from '@mui/material';

interface Props {
    images: string[]
}

export const ItemSlideshow: FC<Props> = ({ images }) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
    {images.map((item) => (
      <ImageListItem key={item}>
        <img
          srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          src={`${item}?w=164&h=164&fit=crop&auto=format`}

          loading="lazy"
        />
      </ImageListItem>
    ))}
  </ImageList>
   
  )
}
