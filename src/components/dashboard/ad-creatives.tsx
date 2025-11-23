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
import { 
  GalleryHorizontal, 
  Eye, 
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react';

type AdCreativesProps = {
  creatives: AdPlan['creatives'];
};

export function AdCreatives({ creatives }: AdCreativesProps) {
  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <GalleryHorizontal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline">
              Ad Creatives
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-generated ad variations ready to deploy
            </p>
          </div>
        </div>
        
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Generate More</span>
        </Button>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {creatives.map((creative, index) => {
            const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
            
            return (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full flex flex-col group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative">
                    {placeholder && (
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                        <Image
                          src={placeholder.imageUrl}
                          alt={placeholder.description}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          data-ai-hint={placeholder.imageHint}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <Button size="sm" variant="secondary" className="flex-1 gap-2">
                              <Eye className="w-4 h-4" />
                              Preview
                            </Button>
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <Badge 
                      className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border shadow-lg"
                      variant="secondary"
                    >
                      {creative.ad_format}
                    </Badge>
                  </div>

                  {/* Content */}
                  <CardHeader className="space-y-3">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {creative.headline}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {creative.segment_name}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {creative.primary_text}
                    </p>
                    
                    {/* Geo Context Hook */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-primary italic">
                        "{creative.geo_context_hook}"
                      </p>
                    </div>
                  </CardContent>

                  {/* CTA Footer */}
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all group/btn"
                      size="lg"
                    >
                      <span>{creative.call_to_action}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <CarouselPrevious className="relative left-0 translate-y-0" />
          <div className="text-sm text-muted-foreground">
            {creatives.length} Creative{creatives.length !== 1 ? 's' : ''}
          </div>
          <CarouselNext className="relative right-0 translate-y-0" />
        </div>
      </Carousel>

    </section>
  );
}
