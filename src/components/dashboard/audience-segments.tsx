import type { AdPlan } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

type AudienceSegmentsProps = {
  segments: AdPlan['audience_segments'];
};

export function AudienceSegments({ segments }: AudienceSegmentsProps) {
  return (
    <section>
       <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight font-headline">
          Audience Segments
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {segments.map((segment, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="font-semibold text-lg hover:no-underline rounded-md px-4 transition-colors hover:bg-muted/50">
              {segment.segment_name}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-4">
              <p className="text-muted-foreground">{segment.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Age Range:</strong> {segment.age_range}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {segment.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary" className="glassmorphism">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferred Channels</h4>
                <div className="flex flex-wrap gap-2">
                  {segment.preferred_channels.map((channel, i) => (
                    <Badge key={i} variant="outline" className="glassmorphism">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
