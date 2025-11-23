import type { AdPlan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GalleryHorizontal } from 'lucide-react';

type AdCreativesProps = {
  creatives: AdPlan['creatives'];
};

export function AdCreatives({ creatives }: AdCreativesProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <GalleryHorizontal className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight font-headline">
          Ad Creatives
        </h2>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {creatives.map((creative, index) => {
            const placeholder =
              PlaceHolderImages[index % PlaceHolderImages.length];
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader>
                      {placeholder && (
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                          <Image
                            src={placeholder.imageUrl}
                            alt={placeholder.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={placeholder.imageHint}
                          />
                        </div>
                      )}
                      <Badge className="absolute top-6 right-6 glassmorphism" variant="default">
                        {creative.ad_format}
                      </Badge>
                      <CardTitle>{creative.headline}</CardTitle>
                      <CardDescription>
                        For: {creative.segment_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">
                        {creative.primary_text}
                      </p>
                      <p className="text-sm text-primary font-semibold mt-4 italic">
                        "{creative.geo_context_hook}"
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {creative.call_to_action}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
    </section>
  );
}
