import { Request, Response } from 'express';
import { ClinicalConfigService } from '../services/ClinicalConfigService';

export class ClinicalConfigController {
    static async getTemplates(req: Request, res: Response) {
        try {
            const templates = await ClinicalConfigService.getTemplates();
            res.json(templates);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSections(req: Request, res: Response) {
        try {
            const sections = await ClinicalConfigService.getSections();
            res.json(sections);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getFields(req: Request, res: Response) {
        try {
            const fields = await ClinicalConfigService.getFields();
            res.json(fields);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createTemplate(req: Request, res: Response) {
        try {
            const template = await ClinicalConfigService.createTemplate(req.body);
            res.status(201).json(template);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createSection(req: Request, res: Response) {
        try {
            const section = await ClinicalConfigService.createSection(req.body);
            res.status(201).json(section);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createField(req: Request, res: Response) {
        try {
            const field = await ClinicalConfigService.createField(req.body);
            res.status(201).json(field);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
