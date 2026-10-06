package gitQuery.backend.services.ai;

import java.util.List;

import gitQuery.backend.dto.CitationDto;

public record RetrievedContext(
        List<CitationDto> citations,
        String contextText) {
}
