INSERT INTO notifications (name, category) VALUES
('DEMO_CLASS_REQUEST_ADDED', 'SERVICE');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('DEMO_CLASS_REQUEST_ADDED_EMAIL_TEMPLATE', '["%userName%"]'::jsonb, 'New Demo Class Request Added',
'<p><strong>%userName%</strong> has added a new demo class request.</p><p>Please log in to the admin dashboard to review and take the necessary actions.</p>');

drop table notification_channel_mapping;
CREATE TABLE notification_channel_mapping (
    id BIGSERIAL PRIMARY KEY,
    notification_id BIGINT REFERENCES notifications(id) ON DELETE CASCADE,
    channel_id BIGINT REFERENCES notification_channels(id) ON DELETE CASCADE,
    template_id BIGINT REFERENCES notification_templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now()
);
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = n.name || '_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL';