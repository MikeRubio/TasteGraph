import jsPDF from "jspdf";
import { format } from "date-fns";
import type { AudiencePersona, ContentSuggestion, CrossDomainRecommendation, CulturalTrend, TasteIntersection } from "./api";

export interface PDFReportData {
  project: {
    title: string;
    description: string;
    industry?: string;
    cultural_domains?: string[];
    geographical_targets?: string[];
    created_at: string;
  };
  insights: {
    audience_personas: AudiencePersona[];
    cultural_trends: CulturalTrend[];
    content_suggestions: ContentSuggestion[];
    taste_intersections?: TasteIntersection[];
    cross_domain_recommendations?: CrossDomainRecommendation[];
    created_at: string;
  };
  chart_images?: {
    affinityRadarChart?: string;
    trendConfidenceChart?: string;
    tasteIntersectionHeatmap?: string;
  };
}

export class PDFReportGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  constructor() {
    this.pdf = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 7;
  }

  private addChartImage(
    dataURL: string,
    caption: string = "",
    width: number = 160,
    height: number = 90
  ): void {
    if (!dataURL) return;
    this.addNewPageIfNeeded(height + 20);
    // Center the image
    const x = (this.pageWidth - width) / 2;
    this.pdf.addImage(dataURL, "PNG", x, this.currentY, width, height);
    this.currentY += height + 5;
    if (caption) {
      this.addText(caption, 9);
    }
    this.currentY += 5;
  }

  private addNewPageIfNeeded(requiredHeight: number = 20): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addHeader(): void {
    // Logo/Brand area
    this.pdf.setFillColor(30, 41, 59); // slate-800
    this.pdf.rect(0, 0, this.pageWidth, 25, "F");

    // Brand text
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text("TasteGraph.ai", this.margin, 15);

    // Subtitle
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text("AI-Powered Audience Discovery Platform", this.margin, 20);

    this.currentY = 35;
  }

  private addFooter(pageNumber: number, totalPages: number): void {
    const footerY = this.pageHeight - 15;

    // Footer line
    this.pdf.setDrawColor(203, 213, 225); // slate-300
    this.pdf.line(
      this.margin,
      footerY - 5,
      this.pageWidth - this.margin,
      footerY - 5
    );

    // Page number
    this.pdf.setTextColor(100, 116, 139); // slate-500
    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(
      `Page ${pageNumber} of ${totalPages}`,
      this.pageWidth - this.margin - 20,
      footerY
    );

    // Generation date
    this.pdf.text(
      `Generated on ${format(new Date(), "MMM d, yyyy")}`,
      this.margin,
      footerY
    );
  }

  private addTitle(
    title: string,
    fontSize: number = 16,
    color: [number, number, number] = [15, 23, 42]
  ): void {
    this.addNewPageIfNeeded(15);
    this.pdf.setTextColor(...color);
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += this.lineHeight + 3;
  }

  private addSubtitle(subtitle: string, fontSize: number = 12): void {
    this.addNewPageIfNeeded(10);
    this.pdf.setTextColor(71, 85, 105); // slate-600
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(subtitle, this.margin, this.currentY);
    this.currentY += this.lineHeight + 2;
  }

  private addText(
    text: string,
    fontSize: number = 10,
    maxWidth?: number
  ): void {
    this.addNewPageIfNeeded(10);
    this.pdf.setTextColor(51, 65, 85); // slate-700
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "normal");

    const textWidth = maxWidth || this.pageWidth - this.margin * 2;
    const lines = this.pdf.splitTextToSize(text, textWidth);

    for (const line of lines) {
      this.addNewPageIfNeeded(this.lineHeight);
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addBulletPoint(text: string, indent: number = 5): void {
    this.addNewPageIfNeeded(10);
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");

    const bulletX = this.margin + indent;
    const textX = bulletX + 5;
    const textWidth = this.pageWidth - textX - this.margin;

    // Add bullet
    this.pdf.circle(bulletX, this.currentY - 2, 0.8, "F");

    // Add text
    const lines = this.pdf.splitTextToSize(text, textWidth);
    for (const line of lines) {
      this.addNewPageIfNeeded(this.lineHeight);
      this.pdf.text(line, textX, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addSeparator(): void {
    this.addNewPageIfNeeded(10);
    this.pdf.setDrawColor(226, 232, 240); // slate-200
    this.pdf.line(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin,
      this.currentY
    );
    this.currentY += 8;
  }

  private addMetricBox(
    label: string,
    value: string,
    color: [number, number, number] = [59, 130, 246]
  ): void {
    const boxWidth = 40;
    const boxHeight = 20;

    this.addNewPageIfNeeded(boxHeight + 5);

    // Box background
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(
      this.margin,
      this.currentY - 5,
      boxWidth,
      boxHeight,
      2,
      2,
      "F"
    );

    // Value
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(value, this.margin + 5, this.currentY + 3);

    // Label
    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(label, this.margin + 5, this.currentY + 10);

    this.currentY += boxHeight + 5;
  }

  private addProgressBar(
    label: string,
    percentage: number,
    color: [number, number, number] = [34, 197, 94]
  ): void {
    this.addNewPageIfNeeded(15);

    const barWidth = 100;
    const barHeight = 4;
    const fillWidth = (barWidth * percentage) / 100;

    // Label
    this.pdf.setTextColor(71, 85, 105);
    this.pdf.setFontSize(9);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(label, this.margin, this.currentY);

    // Percentage
    this.pdf.text(
      `${Math.round(percentage)}%`,
      this.margin + barWidth + 10,
      this.currentY
    );

    // Background bar
    this.pdf.setFillColor(226, 232, 240); // slate-200
    this.pdf.rect(this.margin, this.currentY + 2, barWidth, barHeight, "F");

    // Progress bar
    if (fillWidth > 0) {
      this.pdf.setFillColor(...color);
      this.pdf.rect(this.margin, this.currentY + 2, fillWidth, barHeight, "F");
    }

    this.currentY += 12;
  }

  public async generateReport(data: PDFReportData): Promise<void> {
    // Cover Page
    this.addHeader();

    // Report Title
    this.currentY = 60;
    this.addTitle("Audience Insights Report", 24, [59, 130, 246]);
    this.currentY += 10;

    // Project Info
    this.addTitle(data.project.title, 18);
    this.addText(data.project.description, 11);
    this.currentY += 5;

    // Project Details
    if (data.project.industry) {
      this.addText(`Industry: ${data.project.industry}`, 10);
    }
    if (data.project.cultural_domains?.length) {
      this.addText(
        `Cultural Domains: ${data.project.cultural_domains.join(", ")}`,
        10
      );
    }
    if (data.project.geographical_targets?.length) {
      this.addText(
        `Geographical Targets: ${data.project.geographical_targets.join(", ")}`,
        10
      );
    }

    this.currentY += 10;
    this.addText(
      `Report Generated: ${format(
        new Date(data.insights.created_at),
        "MMMM d, yyyy 'at' h:mm a"
      )}`,
      9
    );

    // Executive Summary
    this.pdf.addPage();
    this.currentY = this.margin;
    this.addTitle("Executive Summary", 18, [147, 51, 234]);

    if (data.chart_images?.affinityRadarChart) {
      this.addTitle("Affinity Radar", 14, [59, 130, 246]);
      this.addChartImage(
        data.chart_images.affinityRadarChart,
        "Affinity Radar Chart (AI-generated personas)"
      );
    }

    if (data.chart_images?.trendConfidenceChart) {
      this.addTitle("Trend Confidence", 14, [147, 51, 234]);
      this.addChartImage(
        data.chart_images.trendConfidenceChart,
        "Trend Confidence Chart"
      );
    }

    if (data.chart_images?.tasteIntersectionHeatmap) {
      this.addTitle("Taste Intersections Heatmap", 14, [34, 197, 94]);
      this.addChartImage(
        data.chart_images.tasteIntersectionHeatmap,
        "Taste Intersection Heatmap"
      );
    }

    // Metrics Overview
    this.addSubtitle("Key Metrics");
    const startY = this.currentY;

    // Create metric boxes in a grid
    this.currentY = startY;
    this.addMetricBox(
      "Personas",
      data.insights.audience_personas?.length.toString() || "0",
      [59, 130, 246]
    );

    this.currentY = startY;
    this.pdf.text("", this.margin + 50, this.currentY); // Move to next column
    this.addMetricBox(
      "Trends",
      data.insights.cultural_trends?.length.toString() || "0",
      [147, 51, 234]
    );

    this.currentY = startY;
    this.pdf.text("", this.margin + 100, this.currentY); // Move to next column
    this.addMetricBox(
      "Content Ideas",
      data.insights.content_suggestions?.length.toString() || "0",
      [34, 197, 94]
    );

    this.currentY = startY + 30;
    this.addSeparator();

    // Audience Personas Section
    if (data.insights.audience_personas?.length > 0) {
      this.addTitle("Audience Personas", 16, [59, 130, 246]);

      data.insights.audience_personas.forEach((persona, index) => {
        this.addNewPageIfNeeded(40);

        this.addSubtitle(
          `${index + 1}. ${persona.name || `Persona ${index + 1}`}`
        );
        this.addText(persona.description || "No description available");
        this.currentY += 3;

        if (persona.demographics?.age_range) {
          this.addText(`Age Range: ${persona.demographics.age_range}`, 9);
        }

        if (persona.characteristics?.length > 0) {
          this.addText("Key Characteristics:", 9);
          persona.characteristics.slice(0, 5).forEach((char: string) => {
            this.addBulletPoint(char);
          });
        }

        if (persona.demographics?.platforms?.length > 0) {
          this.addText(
            `Preferred Platforms: ${persona.demographics.platforms.join(", ")}`,
            9
          );
        }

        // Affinity scores
        if (persona.affinity_scores) {
          this.currentY += 3;
          this.addText("Cultural Affinities:", 9);
          Object.entries(persona.affinity_scores)
            .slice(0, 4)
            .forEach(([domain, score]) => {
              this.addProgressBar(
                domain.replace("_", " ").toUpperCase(),
                (score as number) * 100,
                [59, 130, 246]
              );
            });
        }

        this.currentY += 5;
        this.addSeparator();
      });
    }

    // Cultural Trends Section
    if (data.insights.cultural_trends?.length > 0) {
      this.addTitle("Cultural Trends", 16, [147, 51, 234]);

      data.insights.cultural_trends.forEach((trend, index) => {
        this.addNewPageIfNeeded(30);

        this.addSubtitle(
          `${index + 1}. ${trend.title || `Trend ${index + 1}`}`
        );
        this.addText(trend.description || "No description available");

        if (trend.confidence) {
          this.addProgressBar(
            "Confidence Level",
            trend.confidence,
            [147, 51, 234]
          );
        }

        if (trend.impact) {
          this.addText(`Impact: ${trend.impact}`, 9);
        }

        if (trend.timeline) {
          this.addText(`Timeline: ${trend.timeline}`, 9);
        }

        this.currentY += 5;
        this.addSeparator();
      });
    }

    // Content Suggestions Section
    if (data.insights.content_suggestions?.length > 0) {
      this.addTitle("Content Suggestions", 16, [34, 197, 94]);

      data.insights.content_suggestions.forEach((suggestion, index) => {
        this.addNewPageIfNeeded(25);

        this.addSubtitle(
          `${index + 1}. ${suggestion.title || `Content Idea ${index + 1}`}`
        );
        this.addText(suggestion.description || "No description available");

        if (suggestion.platforms?.length > 0) {
          this.addText(
            `Recommended Platforms: ${suggestion.platforms.join(", ")}`,
            9
          );
        }

        if (suggestion.content_type) {
          this.addText(`Content Type: ${suggestion.content_type}`, 9);
        }

        if (suggestion.copy) {
          this.addText("Sample Copy:", 9);
          this.addText(`"${suggestion.copy}"`, 9);
        }

        this.currentY += 5;
        this.addSeparator();
      });
    }

    // Taste Intersections Section
    if ((data.insights.taste_intersections?.length ?? 0) > 0) {
      this.addTitle("Taste Intersections", 16, [34, 197, 94]);

      (data.insights.taste_intersections ?? []).forEach(
        (intersection, index) => {
          this.addNewPageIfNeeded(30);

          this.addSubtitle(
            `${index + 1}. ${
              intersection.intersection_name || `Intersection ${index + 1}`
            }`
          );
          this.addText(intersection.description || "No description available");

          if (intersection.overlap_percentage) {
            this.addProgressBar(
              "Overlap Percentage",
              intersection.overlap_percentage,
              [34, 197, 94]
            );
          }

          if (intersection.marketing_opportunities?.length > 0) {
            this.addText("Marketing Opportunities:", 9);
            intersection.marketing_opportunities
              .slice(0, 3)
              .forEach((opportunity: string) => {
                this.addBulletPoint(opportunity);
              });
          }

          this.currentY += 5;
          this.addSeparator();
        }
      );
    }

    // Cross-Domain Recommendations Section
    if ((data.insights.cross_domain_recommendations?.length ?? 0) > 0) {
      this.addTitle("Cross-Domain Recommendations", 16, [6, 182, 212]);

      data.insights.cross_domain_recommendations?.forEach(
        (recommendation, index) => {
          this.addNewPageIfNeeded(30);

          this.addSubtitle(
            `${index + 1}. ${
              recommendation.recommendation_title ||
              `Recommendation ${index + 1}`
            }`
          );
          this.addText(
            recommendation.description || "No description available"
          );

          if (recommendation.source_domain && recommendation.target_domain) {
            this.addText(
              `Expansion: ${recommendation.source_domain} → ${recommendation.target_domain}`,
              9
            );
          }

          if (recommendation.confidence_score) {
            this.addProgressBar(
              "Confidence Score",
              recommendation.confidence_score,
              [6, 182, 212]
            );
          }

          if (recommendation.audience_fit) {
            this.addProgressBar(
              "Audience Fit",
              recommendation.audience_fit * 100,
              [34, 197, 94]
            );
          }

          if (recommendation.expansion_opportunities?.length > 0) {
            this.addText("Expansion Opportunities:", 9);
            recommendation.expansion_opportunities
              .slice(0, 3)
              .forEach((opportunity: string) => {
                this.addBulletPoint(opportunity);
              });
          }

          this.currentY += 5;
          this.addSeparator();
        }
      );
    }

    // Add page numbers to all pages
    const totalPages = this.pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.addFooter(i, totalPages);
    }
  }

  public save(filename: string): void {
    this.pdf.save(filename);
  }

  public getBlob(): Blob {
    return this.pdf.output("blob");
  }
}

// Utility function to generate and download PDF report
export async function generatePDFReport(
  data: PDFReportData,
  filename?: string
): Promise<void> {
  const generator = new PDFReportGenerator();
  await generator.generateReport(data);

  const defaultFilename = `${data.project.title
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}_insights_report.pdf`;
  generator.save(filename || defaultFilename);
}
