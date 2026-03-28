'use client';

import type { CarouselProps, CarouselOptions } from './types';

import { mergeClasses } from 'minimal-shared/utils';
// CORREÇÃO 1: Importar React para usar tipos como React.ReactElement
import React, { Children, isValidElement } from 'react';

import { styled, type Theme } from '@mui/material/styles';

import { carouselClasses } from './classes';
import { CarouselSlide } from './components/carousel-slide';

// ----------------------------------------------------------------------

export function Carousel({
  sx,
  carousel,
  children,
  slotProps,
  className,
  ...other
}: CarouselProps) {
  const { mainRef, options } = carousel;

  const axis = options?.axis ?? 'x';
  const slideSpacing = options?.slideSpacing ?? '0px';

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child as React.ReactElement<{ key?: React.Key }>;

        return (
          <CarouselSlide key={reactChild.key} options={carousel.options} sx={slotProps?.slide}>
            {child}
          </CarouselSlide>
        );
      }
      return null;
    });

  return (
    <CarouselRoot
      sx={sx}
      ref={mainRef}
      axis={axis}
      className={mergeClasses([carouselClasses.root, className])}
      {...other}
    >
      <CarouselContainer
        axis={axis}
        slideSpacing={slideSpacing}
        className={carouselClasses.container}
        // CORREÇÃO 2: Simplificação da lógica de mesclagem do SX
        sx={[
          (theme: Theme) => ({
            ...(carousel.pluginNames?.includes('autoHeight') && {
              alignItems: 'flex-start',
              transition: theme.transitions.create(['height'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
            }),
          }),
          ...(Array.isArray(slotProps?.container)
            ? slotProps.container
            : [slotProps?.container]),
        ]}
      >
        {renderChildren()}
      </CarouselContainer>
    </CarouselRoot>
  );
}

// ----------------------------------------------------------------------

// CORREÇÃO 3: Substituição da sintaxe 'variants' por lógica condicional direta
const CarouselRoot = styled('div', {
  shouldForwardProp: (prop: string) => !['axis', 'sx'].includes(prop),
})<Pick<CarouselOptions, 'axis'>>(({ axis }) => ({
  margin: 'auto',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative',
  // Lógica direta em vez de 'variants'
  ...(axis === 'y' && {
    height: '100%',
  }),
}));

// CORREÇÃO 4: Substituição da sintaxe 'variants' e desestruturação correta das props
const CarouselContainer = styled('ul', {
  shouldForwardProp: (prop: string) => !['axis', 'slideSpacing', 'sx'].includes(prop),
})<Pick<CarouselOptions, 'axis' | 'slideSpacing'>>(({ axis, slideSpacing }) => ({
  display: 'flex',
  backfaceVisibility: 'hidden',
  // Aplica estilos baseados na prop 'axis'
  ...(axis === 'x' && {
    touchAction: 'pan-y pinch-zoom',
    marginLeft: `calc(${slideSpacing} * -1)`,
  }),
  ...(axis === 'y' && {
    height: '100%',
    flexDirection: 'column',
    touchAction: 'pan-x pinch-zoom',
    marginTop: `calc(${slideSpacing} * -1)`,
  }),
}));
