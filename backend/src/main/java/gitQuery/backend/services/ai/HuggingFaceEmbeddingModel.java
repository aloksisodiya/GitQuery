package gitQuery.backend.services.ai;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.embedding.EmbeddingResponseMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** EmbeddingModel backed by the hosted Hugging Face Inference API. */
@Component
public class HuggingFaceEmbeddingModel implements EmbeddingModel {
    private final RestClient client;
    private final String model;
    private final int dimensions;

    public HuggingFaceEmbeddingModel(
            RestClient.Builder restClientBuilder,
            @Value("${app.huggingface.embedding.url}") String url,
            @Value("${app.huggingface.api-token}") String apiToken,
            @Value("${app.huggingface.embedding.model}") String model,
            @Value("${app.huggingface.embedding.dimensions}") int dimensions) {
        this.client = restClientBuilder
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
        this.url = url;
        this.model = model;
        this.dimensions = dimensions;
    }

    private final String url;

    @Override
    public EmbeddingResponse call(EmbeddingRequest request) {
        List<String> instructions = request.getInstructions();
        Object response = client.post()
                .uri(url)
                .body(new RequestBody(instructions))
                .retrieve()
                .body(Object.class);

        List<float[]> vectors = parseVectors(response);
        List<Embedding> embeddings = new ArrayList<>(vectors.size());
        for (int index = 0; index < vectors.size(); index++) {
            embeddings.add(new Embedding(vectors.get(index), index));
        }

        EmbeddingResponseMetadata metadata = new EmbeddingResponseMetadata();
        metadata.setModel(model);
        return new EmbeddingResponse(embeddings, metadata);
    }

    @Override
    public float[] embed(Document document) {
        return embed(getEmbeddingContent(document));
    }

    @Override
    public int dimensions() {
        return dimensions;
    }

    private List<float[]> parseVectors(Object response) {
        if (!(response instanceof List<?> values) || values.isEmpty()) {
            throw new IllegalStateException("Hugging Face returned no embeddings");
        }

        if (values.get(0) instanceof Number) {
            return List.of(toVector(values));
        }

        List<float[]> vectors = new ArrayList<>(values.size());
        for (Object value : values) {
            if (!(value instanceof List<?> vector)) {
                throw new IllegalStateException("Unexpected Hugging Face embedding response");
            }
            vectors.add(toVector(vector));
        }
        return vectors;
    }

    private float[] toVector(List<?> values) {
        float[] vector = new float[values.size()];
        for (int index = 0; index < values.size(); index++) {
            Object value = values.get(index);
            if (!(value instanceof Number number)) {
                throw new IllegalStateException("Hugging Face returned a non-numeric embedding value");
            }
            vector[index] = number.floatValue();
        }
        if (vector.length != dimensions) {
            throw new IllegalStateException(
                    "Expected " + dimensions + " embedding dimensions but received " + vector.length);
        }
        return vector;
    }

    private record RequestBody(List<String> inputs) {
    }
}